import { BadRequestException, Injectable,NotAcceptableException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FollowRepository } from 'src/follow/repositories/follow.repository';
import { UserRepository } from 'src/users/repositories/user.repository';
import { CreateArticleDto } from './dto/createArticle.dto';
import { UpdateArticleDto } from './dto/updateArticle.dto';
import { ArticleRepository } from './repositories/article.repository';
import { ArticleToTagRepository } from './repositories/article_tag.repository';
import { TagRepository } from './repositories/tag.repository';
import { TrackRepository } from './repositories/track.repository';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(ArticleRepository)
    private articleRepository: ArticleRepository,
    @InjectRepository(TrackRepository)
    private trackRepository: TrackRepository,
    @InjectRepository(TagRepository)
    private tagRepository: TagRepository,
    @InjectRepository(ArticleToTagRepository)
    private articleToTagRepository: ArticleToTagRepository,
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    @InjectRepository(FollowRepository)
    private followRepository: FollowRepository
  ) {}
  
  async getMain(id: number, loginmethod: number, page: number, pageSize: number): Promise<object>{
    const getFollowing = await this.followRepository.getFollowingUser(id);

    console.log("getFollowing", getFollowing);
    if(!getFollowing) {
      throw new UnauthorizedException('permisson denied');
    } else if(getFollowing.length === 0) {
      throw new NotFoundException("Not have a following list");
    }

    const getMain = await this.articleRepository.getMain(getFollowing, page, pageSize);
    console.log("getMain", getMain);
    if(!getMain) {
      throw new UnauthorizedException('permisson denied');
    } else if(Object.keys(getMain).length === 0) {
      throw new NotFoundException("Not exist an extra articles");
    }
    
    return {
      data: {
        article: getMain
      },
      message: 'ok'
    }
  }

  async findOrCreateTags(user: number, articleId: number, tag: []): Promise<any>{
    const beforeTagCount = tag.length;

    for(const eachTag of tag) {
      const { tagname, order }= eachTag;
      console.log("tagName ===", tagname);
      const isTagExist = await this.tagRepository.findTagName(tagname);
      // 태그가 없으면 만들어주기
      if(!isTagExist || isTagExist.length === 0) {
        const createTagResult = await this.tagRepository.createTag(tagname);
        const tagId = createTagResult.id;
        await this.articleToTagRepository.connectArticleTag(articleId, tagId, order, tagname);
      // 태그가 있다면 기존 태그 조회해서 만들어주기
      } else {
        const tagId = isTagExist[0].id;
        await this.articleToTagRepository.connectArticleTag(articleId, tagId, order, tagname);
      }
    }
    const afterTagCount = await this.articleToTagRepository.countTag(articleId);

    return beforeTagCount === afterTagCount
  }
  
  async getResponseData(userId, articleId): Promise<object> {
    const userInfo = await this.userRepository.getUserInfo(userId);
    const articleInfo = await this.articleRepository.getArticleInfo(articleId);
    return {
      data: {
        userInfo:{
          userId: userInfo.id,
          nickName: userInfo.nickname,
          profileImage: userInfo.profile_image
        },
        articleInfo: {
          totalLike: articleInfo.total_like,
          totalComment: articleInfo.total_comment,
          content: articleInfo.content,
          road: articleInfo.road,
          tag: articleInfo.tags,
          comment: articleInfo.comments,
        }  
    },
    message: 'article created'
    }
  }

  async getRecent(page: number, pageSize: number): Promise<object>{
    const getRecent = await this.articleRepository.getRecent(page, pageSize);
    return getRecent
  }

  async createArticle(createArticleDto: CreateArticleDto): Promise<any> {
    const { user, road, tag, content, thumbnail } = createArticleDto;
    // article 메인 테이블 삽입 요청
    try {
      const articleResult = await this.articleRepository.createArticle(user, content, thumbnail);
      if(!articleResult) {
        throw new UnauthorizedException("permisson denied");
      } else {
        const articleId = articleResult.id;
        // track 경로 삽입 요청
        await this.trackRepository.createTrack(road, articleId);
        // tag 삽입 요청
        const tagResult = await this.findOrCreateTags(user, articleId, tag);
        if(tagResult) {
          return await this.getResponseData(user, articleId);
        } else {
          throw new UnauthorizedException("permisson denied");
        }
      }
    } catch (err) {
      console.error(err);
      throw new UnauthorizedException("permisson denied");
    }
  }

  async getArticleDetail(id: number, user: number): Promise<object>{
    const result = await this.articleRepository.getArticleDetail(id)
    if(!result) {
      throw new NotFoundException('Not found');
    }

    return {
      data: {
        articleInfo: result,
      },
      message: 'ok'
    } 
  }

  

  async updateArticle(updateArticleDto: UpdateArticleDto): Promise<any>{
    const {user, articleId, content, tag} = updateArticleDto;

    if(content) {
      const result = await this.articleRepository.updateContent(updateArticleDto);  
      if(result.affected === 0) {
        throw new BadRequestException();
      }
    }

    if(tag) {
      // 기존에 있던 태그 전부 삭제
      const deletion = await this.articleToTagRepository.deleteTags(articleId);
      // tag를 찾거나 만들어주는 로직으로 Go
      const result = await this.findOrCreateTags(user, articleId, tag);
      if(result) {
        return await this.getResponseData(user, articleId);
      }

    }
  }

  async deleteArticle(id: number, user: number, loginmethod: number) {
    const result = await this.articleRepository.deleteArticle(id);
    return result;
  }
}
