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
  
  async getMain(id: number, loginmethod: number): Promise<object> {
    const getFollowing = await this.followRepository.getFollowing(id);

    console.log("getFollowing", getFollowing);
    if(!getFollowing || getFollowing.length === 0) {
      throw new UnauthorizedException('permisson denied');
    } 

    const getMain = await this.articleRepository.getMain(getFollowing);
    console.log("getMain", getMain);
    if(!getMain || Object.keys(getMain).length === 0) {
      throw new UnauthorizedException('permisson denied');
    } 
    
    return {
      data: {
        article: getMain
      },
      message: 'ok'
    }
  }
  
  async getResponseData(userId, articleId): Promise<object> {
    const userInfo = await this.userRepository.getUserInfo(userId);
    console.log("userInfo", userInfo);
    const articleInfo = await this.articleRepository.getArticleInfo(articleId);
    console.log("articleInfo", articleInfo);
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
          comment: articleInfo.comments,
        }  
    },
    message: 'article created'
    }
  }

  async createArticle(createArticleDto: CreateArticleDto): Promise<any> {
    const { userId, road, tag, content, thumbnail } = createArticleDto;
    console.log("createArticleDto", createArticleDto);
    // article 메인 테이블 삽입 요청
    try {
      const articleResult = await this.articleRepository.createArticle(userId, content, thumbnail);
      if(!articleResult) {
        throw new NotAcceptableException("");
      } else {
        const articleId = articleResult.id;
        await this.trackRepository.createTrack(road, articleId);
        tag.forEach(async (eachTag) => {
          const {tagname, order}= eachTag;
          const isTagExist = await this.tagRepository.findTagName(tagname);
          // 태그가 없으면 만들어주기
          if(!isTagExist || isTagExist.length === 0) {
            const createTagResult = await this.tagRepository.createTag(tagname);
            const tagId = createTagResult.id;
            const createArticleTagResult = await this.articleToTagRepository.connectArticleTag(articleId, tagId, order);
            if(createArticleTagResult) {
              return this.getResponseData(userId, articleId);
            }
          // 태그가 있다면 기존 태그 조회해서 만들어주기
          } else {
            const tagId = isTagExist[0].id;
            // console.log("tagId", tagId);
            const createArticleTagResult = await this.articleToTagRepository.connectArticleTag(articleId,tagId , order);
            if(createArticleTagResult) {
              return this.getResponseData(userId, articleId);
            }
          }
        })
    }
  } catch (err) {
      throw err;
    }
  }

  async getArticleDetail(id: number): Promise<object>{
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

  async findOrCreateTags(updateArticleDto: UpdateArticleDto) {
    const {userId, articleId, tag} = updateArticleDto;
    
    tag.forEach(async (eachTag) => {
      const { tagname, order }= eachTag;
      const isTagExist = await this.tagRepository.findTagName(tagname);
      // 태그가 없으면 만들어주기
      if(!isTagExist || isTagExist.length === 0) {
        const createTagResult = await this.tagRepository.createTag(tagname);
        const tagId = createTagResult.id;
        const createArticleTagResult = await this.articleToTagRepository.connectArticleTag(articleId, tagId, order);
        if(createArticleTagResult) {
          return this.getResponseData(userId, articleId);
        }
      // 태그가 있다면 기존 태그 조회해서 만들어주기
      } else {
        const tagId = isTagExist[0].id;
        const createArticleTagResult = await this.articleToTagRepository.connectArticleTag(articleId,tagId , order);
        if(createArticleTagResult) {
          return this.getResponseData(userId, articleId);
        }
      }
    })
  }

  async updateArticle(updateArticleDto: UpdateArticleDto): Promise<any>{
    const {userId, articleId, content, tag} = updateArticleDto;

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
      const result = await this.findOrCreateTags(updateArticleDto);
    }
  }

  async deleteArticle(id: number, loginmethod: number) {
    const result = await this.articleRepository.deleteArticle(id);
    return result;
  }
}