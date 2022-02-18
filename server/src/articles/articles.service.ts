import { BadRequestException, Injectable,InternalServerErrorException,NotAcceptableException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentRepository } from 'src/comment/repositories/comment.repository';
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
    private followRepository: FollowRepository,
    @InjectRepository(CommentRepository)
    private commentRepository: CommentRepository
  ) {}
  
  async getMain(user: number, page: number): Promise<object>{
    
      const getFollowing = await this.followRepository.getFollowingIds(user);
    
      if(!getFollowing) {
        throw new UnauthorizedException('permisson denied');
      } else if(getFollowing.length === 0) {
        throw new NotFoundException("Not have a following list");
      }
      console.log(`following 하는 유저의 ID값은 ${getFollowing}입니다.`);
      const newArticles = []
      try {
      let limit: number = 9;
      let offset: number = (page - 1) * 9;
      const articles = await this.articleRepository.getArticleInfo(getFollowing, limit, offset);

      console.log(`가져온 게시물 정보는 ${articles}입니다.`)
        // 각 게시물에 태그 이름(배열) 추가
        for(const article of articles) {
          const userId: number = await this.articleRepository.getUserId(article.id);
          console.log("userId", userId);
          const writer: string = await this.userRepository.getUsername(userId);
          console.log("writer", writer);
          const tagIds: object = await this.articleToTagRepository.getTagIds(article.id);
          console.log("tagIds", tagIds);
          const tagNames: string[] = await this.tagRepository.getTagNameWithIds(tagIds);
          console.log("tagNames", tagNames);
          article.tags = tagNames;

        // API 문서에 양식에 맞게 네이밍
          interface articleObject {
            id: string,
            thumbnail: string,
            nickname: string
            totalLike: number,
            totalComment: number,
            tags: string[]
          }
          let creation: articleObject = {
            id: article.id,
            thumbnail: article.thumbnail,
            nickname: writer,
            totalLike: article.totalLike,
            totalComment: article.totalComment,
            tags: article.tags
          };
          newArticles.push(creation);
        }
      return {
        data: {
          articles: newArticles
        },
        message: 'ok'
      }
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException('err');
    }
  }


  async findOrCreateTags(user: number, articleId: number, tag: []): Promise<any>{
    const beforeTagCount = tag.length;
    console.log(`Tag 갯수는 ${beforeTagCount}`)
    for(const eachTag of tag) {
      const { tagName, order }= eachTag;
      const isTagExist = await this.tagRepository.findTagName(tagName);
      // 태그가 없으면 만들어주기
      if(!isTagExist || isTagExist.length === 0) {
        const createTagResult = await this.tagRepository.createTag(tagName);
        const tagId = createTagResult.id;
        await this.articleToTagRepository.connectArticleTag(articleId, tagId, order, tagName);
      // 태그가 있다면 기존 태그 조회해서 만들어주기
      } else {
        const tagId = isTagExist[0].id;
        await this.articleToTagRepository.connectArticleTag(articleId, tagId, order, tagName);
      }
    }
    const afterTagCount = await this.articleToTagRepository.countTag(articleId);

    return beforeTagCount === afterTagCount
  }
  
  async getResponseData(userId, articleId): Promise<object> {
    try {
    const userInfo = await this.userRepository.getUserInfo(userId);
    console.log("userInfo", userInfo);
    const articleInfo = await this.articleRepository.getArticleUsingId(articleId);
    console.log("articleInfo", articleInfo);
    const tagIds = await this.articleToTagRepository.getTagIds(articleInfo.id);
    console.log("tagIds", tagIds);
    const tagNames = await this.tagRepository.getTagNameWithIds(tagIds);
    console.log("tagNames", tagNames);
    const comments = await this.commentRepository.getComments(articleInfo.id);
    console.log("comments", comments);
    const roads = await this.trackRepository.getRoads(articleInfo.id);
    console.log("roads", roads);
    let article: {}

      if(!comments|| Object.keys(comments).length === 0) {
        article = {
          id: articleInfo.id,
          thumbnail: articleInfo.thumbnail,
          nickname: userInfo.nickname,
          content: articleInfo.content,
          totalLike: articleInfo.totalLike,
          totalComment: articleInfo.totalComment,
          tags: tagNames,
          roads,
          comments: []
        }
      } else {
        const commentUserInfo = await this.userRepository.getUserInfo(comments.userId);
        article = {
          id: articleInfo.id,
          thumbnail: articleInfo.thumbnail,
          nickname: userInfo.nickname,
          content: articleInfo.content,
          totalLike: articleInfo.totalLike,
          totalComment: articleInfo.totalComment,
          tags: tagNames,
          roads,
          comments: {
            id: comments.id,
            userId: comments.userId,
            profileImage: commentUserInfo.profileImage || "",
            nickname: commentUserInfo.nickname,
            comment: comments.comment,
            createdAt: comments.createdAt
          }
        }
      }
      

      return {
        data: {
          userInfo: {
            id: userInfo.id,
            nickname: userInfo.nickname,
            profileImage: userInfo.profileImage
          },
          articleInfo: article
        },
        message: 'ok'
      }
    } catch (err) {
      console.error(err);
      throw new UnauthorizedException('permisson denied');
    }
  }

  async getRecent(page: number): Promise<object> {
    let limit: number = 9;
    let offset: number = (page - 1) * 9;
    const articles = await this.articleRepository.getArticleInfo([], limit, offset);

      // 각 게시물에 태그 이름(배열) 추가
      let newArticles = [];
      for(const article of articles) {
        const userId: number = await this.articleRepository.getUserId(article.id);
        const writer: string = await this.userRepository.getUsername(userId);
        const tagIds: object = await this.articleToTagRepository.getTagIds(article.id);
        const tagNames: string[] = await this.tagRepository.getTagNameWithIds(tagIds);
        article.tags = tagNames;

        interface articleObject {
          id: string,
          thumbnail: string,
          nickname: string
          totalLike: number,
          totalComment: number,
          tags: string[]
        }
        let creation: articleObject = {
          id: article.id,
          thumbnail: article.thumbnail,
          nickname: writer,
          totalLike: article.total_like,
          totalComment: article.total_comment,
          tags: article.tags
        };
        newArticles.push(creation);
      }
    return {
      data: {
        articles: newArticles
      },
      message: 'ok'
    }
  } catch (err) {
    console.log(err);
    throw new InternalServerErrorException('err');
  }

  async createArticle(createArticleDto: CreateArticleDto): Promise<any> {
    const { user, road, tag, content, thumbnail } = createArticleDto;
    console.log("{ user, road, tag, content, thumbnail }", {user, road, tag, content, thumbnail });
    // article 메인 테이블 삽입 요청
    try {
      const articleResult = await this.articleRepository.createArticle(user, content, thumbnail);
      if(!articleResult) {
        throw new UnauthorizedException("permisson denied");
      } else {
        // console.log("Article Table Insert 완료!");
        const articleId = articleResult.id;
        // console.log("articleId====", articleId);
        // track 경로 삽입 요청
        // console.log("Track Insert 시도!");
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

  async getArticleDetail(id: number, user: number): Promise<any>{
    try {
      const userInfo = await this.userRepository.getUserInfo(user);
      const articleInfo = await this.articleRepository.getArticleDetail(id);
      // // 각 게시물에 태그 이름(배열) 추가
      const tagIds = await this.articleToTagRepository.getTagIds(articleInfo.id);
      const tagNames = await this.tagRepository.getTagNameWithIds(tagIds);
      const comments = await this.commentRepository.getComments(articleInfo.id);
      const roads = await this.trackRepository.getRoads(articleInfo.id);
      
      let article = {};
      if(!comments|| Object.keys(comments).length === 0) {
        article = {
          id: articleInfo.id,
          thumbnail: articleInfo.thumbnail,
          nickname: userInfo.nickname,
          content: articleInfo.content,
          totalLike: articleInfo.totalLike,
          totalComment: articleInfo.totalComment,
          tags: tagNames,
          roads,
          comments: []
        }
      } else {
        const commentUserInfo = await this.userRepository.getUserInfo(comments.userId);
        article = {
          id: articleInfo.id,
          thumbnail: articleInfo.thumbnail,
          nickname: userInfo.nickname,
          content: articleInfo.content,
          totalLike: articleInfo.totalLike,
          totalComment: articleInfo.totalComment,
          tags: tagNames,
          roads,
          comments: {
            id: comments.id,
            userId: comments.userId,
            profileImage: commentUserInfo.profileImage || "",
            nickname: commentUserInfo.nickname,
            comment: comments.comment,
            createdAt: comments.createdAt
          }
        }
      }

      return {
        data: {
          userInfo: {
            id: userInfo.id,
            nickname: userInfo.nickname,
            profileImage: userInfo.profileImage
          },
          articleInfo: article
        },
        message: 'ok'
      }
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException('err');
    }
  }
  

  async updateArticle(updateArticleDto: UpdateArticleDto): Promise<any>{
    const {user, articleId, content, tag} = updateArticleDto;

    if(content) {
      const isOwner = await this.articleRepository.isOwner(user, articleId)
      if(isOwner) {
        const result = await this.articleRepository.updateContent(updateArticleDto);  
        if(!result) {
          throw new BadRequestException();
        }
      }
    }
    if(tag) {
      // 기존에 있던 태그 전부 삭제
      await this.articleToTagRepository.deleteTags(articleId);
      // tag를 찾거나 만들어주는 로직으로 Go
      const result = await this.findOrCreateTags(user, articleId, tag);
      if(result) {
        return await this.getResponseData(user, articleId);
      }
    }
  }

  async deleteArticle(id: number, user: number) {
    const result = await this.articleRepository.deleteArticle(id, user);
    return result;
  }
}
