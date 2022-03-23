import {
  BadGatewayException,
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentRepository } from 'src/comments/repositories/comments.repository';
import { FollowRepository } from 'src/follow/repositories/follow.repository';
import { LikesRepository } from 'src/likes/repositories/likes.repository';
import { UserRepository } from 'src/users/repositories/user.repository';
import { CreateArticleDto } from './dto/createArticle.dto';
import { UpdateArticleDto } from './dto/updateArticle.dto';
import { ArticleToTag } from './entities/article_tag.entity';
import { Tag } from './entities/tag.entity';
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
    private commentRepository: CommentRepository,
    @InjectRepository(LikesRepository)
    private likesRepository: LikesRepository  
  ) {}

  async getMain(user: number, page: number): Promise<object> {
    const getFollowing = await this.followRepository.getFollowingIds(user);
    if (!getFollowing) {
      throw new UnauthorizedException('permisson denied');
    } else if (getFollowing.length === 0) {
      throw new NotFoundException('cannot find articles')
    }
    const newArticles = [];
    try {
      let limit: number = 9;
      let offset: number = (page - 1) * 9;
      const articles = await this.articleRepository.getArticleInfo(
        getFollowing,
        limit,
        offset,
      );
      if(!articles.length) throw new NotFoundException();

      // 각 게시물에 태그 이름(배열) 추가
      for (const article of articles) {
        const userId: number = await this.articleRepository.getUserId(
          article.id,
        );
        const writer: string = await this.userRepository.getUsername(userId);
        const profileImage: string = await this.userRepository.getProfileImage(userId);
        const tagIds: number[] = await this.articleToTagRepository.getTagIds(
          article.id,
        );
        let tagNames: string[] = [];

        tagIds.forEach(async (tagId) => {
          const tagName: string = await this.tagRepository.getTagNameWithIds(tagId);
          tagNames.push(tagName);
        })
        article.tags = tagNames;

        // API 문서에 양식에 맞게 네이밍
        interface articleObject {
          id: string;
          userId:number;
          thumbnail: string;
          nickname: string;
          profileImage: string;
          totalLike: number;
          totalComment: number;
          tags: string[];
        }
        let creation: articleObject = {
          id: article.id,
          userId:userId,
          thumbnail: article.thumbnail,
          nickname: writer,
          profileImage,
          totalLike: article.totalLike,
          totalComment: article.totalComment,
          tags: article.tags,
        };
        newArticles.push(creation);
      }
      return {
        data: {
          articles: newArticles,
        },
        message: 'ok',
      };
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException('err');
    }
  }

  async findOrCreateTags(
    user: number,
    articleId: number,
    tag: [] | object[],
  ): Promise<string[]> {
    // for (const eachTag of tag) {
    //   const { tagName, order } = eachTag;
    //   const isTagExist = await this.tagRepository.findTagName(tagName);
    //   // 태그가 없으면 만들어주기
    //   if (!isTagExist || isTagExist.length === 0) {
    //     const createTagResult = await this.tagRepository.createTag(tagName);
    //     const tagId = createTagResult.id;
    //     await this.articleToTagRepository.connectArticleTag(articleId, tagId, order);
    //     // 태그가 있다면 기존 태그 조회해서 만들어주기
    //   } else {
    //     const tagId = isTagExist[0].id;
    //     await this.articleToTagRepository.connectArticleTag(articleId, tagId, order);
    //   }
    // }
    // const afterTagCount = await this.articleToTagRepository.countTag(articleId);
    try {
      return await Promise.all(
        tag.map(async (eachTag) => {
          const { tagName, order } = eachTag;
          let tagInfo = await this.tagRepository.findOne({ tagName });
          if (!tagInfo) {
            const newTag: Tag = this.tagRepository.create({ tagName });
            tagInfo = await this.tagRepository.save(newTag);
          }
          const newArticleTag: ArticleToTag =
            this.articleToTagRepository.create({
              tagId: tagInfo.id,
              order,
              articleId,
            });
          await this.articleToTagRepository.save(newArticleTag);
          return tagInfo.tagName;
        }),
      );
    } catch {
      throw new BadGatewayException();
    }
  }

  async getRecent(page: number): Promise<object> {
    let limit: number = 9;
    let offset: number = (page - 1) * 9;
    const articles = await this.articleRepository.getArticleInfo(
      [],
      limit,
      offset,
    );
    if(!articles.length){
      throw new NotFoundException('cannot find articles')
    }
    // 각 게시물에 태그 이름(배열) 추가
    let newArticles = [];
    for (const article of articles) {
      const userId: number = await this.articleRepository.getUserId(article.id);
      const writer: string = await this.userRepository.getUsername(userId);
      const profileImage: string = await this.userRepository.getProfileImage(userId);
      const tagIds: number[] = await this.articleToTagRepository.getTagIds(
        article.id,
      );
      let tagNames: string[] = [];

        tagIds.forEach(async (tagId) => {
          const tagName: string = await this.tagRepository.getTagNameWithIds(tagId);
          tagNames.push(tagName);
        })
      article.tags = tagNames;

      interface articleObject {
        id: string;
        userId:number;
        thumbnail: string;
        nickname: string;
        profileImage: string;
        totalLike: number;
        totalComment: number;
        tags: string[];
      }
      let creation: articleObject = {
        id: article.id,
        userId:userId,
        thumbnail: article.thumbnail,
        nickname: writer,
        profileImage,
        totalLike: article.totalLike,
        totalComment: article.totalComment,
        tags: article.tags,
      };
      newArticles.push(creation);
    }
    return {
      data: {
        articles: newArticles,
      },
      message: 'ok',
    };
  }
  catch(err) {
    console.log(err);
    throw new InternalServerErrorException('err');
  }

  async createArticle(createArticleDto: CreateArticleDto): Promise<any> {
    const { user, road, tag, content, thumbnail } = createArticleDto;
    const userInfo = await this.userRepository.findOne({
      where: { id: user },
      select: ['id', 'nickname', 'profileImage'],
    });
    if (!userInfo) throw new NotFoundException('cannot find user');
    const articleResult = await this.articleRepository.createArticle(
      user,
      content,
      thumbnail,
    );
    const articleId = articleResult.id;
    try {
      const trackList = await this.trackRepository.createTrack(road, articleId);
      const tagList = await this.findOrCreateTags(user, articleId, tag);
      return {
        data: {
          userInfo,
          articleInfo: {
            id: articleId,
            totalLike: articleResult.totalLike,
            totalComment: articleResult.totalComment,
            roads: trackList,
            tags: tagList,
            comments: [],
          },
        },
        message: 'article created',
      };
    } catch {
      this.articleRepository.deleteArticle(articleId);
      throw new BadRequestException('bad request');
    }
  }

  async getArticleDetail(id: number, user?: number): Promise<any> {
    try {
      // const userInfo = await this.userRepository.getUserInfo(user);
      const articleInfo = await this.articleRepository.getArticleDetail(id);
      const userInfo = await this.userRepository.getUserInfo(articleInfo.userId);
      const likedOrNot = await this.likesRepository.likeOrNot(user || undefined, id);
      // // 각 게시물에 태그 이름(배열) 추가
      const tagIds = await this.articleToTagRepository.getTagIds(
        articleInfo.id,
      );
      let tagNames = [];
      for(let tagId of tagIds) {
        const tagName: string = await this.tagRepository.getTagNameWithIds(tagId);
        tagNames.push(tagName)
      }
      // const tagNames = await this.tagRepository.getTagNameWithIds(tagIds);
      // const comments = await this.commentRepository.getComments(articleInfo.id);
      const roads = await this.trackRepository.getRoads(articleInfo.id);
      let article = {};
      // if (!comments || comments.length === 0) {
      //   article = {
      //     id: articleInfo.id,
      //     thumbnail: articleInfo.thumbnail,
      //     nickname: userInfo.nickname,
      //     content: articleInfo.content,
      //     createdAt: articleInfo.createdAt,
      //     totalLike: articleInfo.totalLike,
      //     totalComment: articleInfo.totalComment,
      //     likedOrNot: likedOrNot,
      //     tags: tagNames,
      //     roads,
      //     comments: [],
      //   };
      // } else {
      //   const commentsList = await Promise.all(
      //     comments.map(async (comment) => {
      //       const commentUserInfo = await this.userRepository.getUserInfo(
      //         comment.userId,
      //       );
      //       return {
      //         id: comment.id,
      //         userId: comment.userId,
      //         profileImage: commentUserInfo.profileImage,
      //         nickname: commentUserInfo.nickname,
      //         comment: comment.comment,
      //         createdAt: comment.createdAt,
      //       };
      //     }),
      //   );
        article = {
          id: articleInfo.id,
          thumbnail: articleInfo.thumbnail,
          // nickname: userInfo.nickname,
          content: articleInfo.content,
          totalLike: articleInfo.totalLike,
          totalComment: articleInfo.totalComment,
          likedOrNot: likedOrNot,
          createdAt: articleInfo.createdAt,
          tags: tagNames,
          roads,
          // comments: commentsList,
        };
      // }

      return {
        data: {
          userInfo: {
            id: userInfo.id,
            nickname: userInfo.nickname,
            profileImage: userInfo.profileImage,
          },
          articleInfo: article,
        },
        message: 'ok',
      };
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException('err');
    }
  }

  async updateArticle(updateArticleDto: UpdateArticleDto): Promise<any> {
    const { user, articleId, content, tag } = updateArticleDto;
    const articleInfo = await this.articleRepository.findOne({
      where: { id: articleId },
      select: ['id', 'content', 'totalComment', 'totalLike', 'userId'],
    });
    if (!articleInfo) throw new NotFoundException('cannot find article');
    if (user !== articleInfo.userId)
      throw new ForbiddenException('permission denied');
    if (content) this.articleRepository.update({ id: articleId }, { content });
    const userInfo = await this.userRepository.findOne({
      where: { id: user },
      select: ['id', 'nickname', 'profileImage'],
    });
    const lastTags: Array<any> = await this.articleToTagRepository.find({
      where: { articleId },
      select: ['tagId', 'order'],
    });
    // const commentsList = await this.commentRepository.getComments(articleId);
    const roads = await this.trackRepository.getRoads(articleId);
    // const comments = await Promise.all(
    //   commentsList.map(async (comment) => {
    //     const commentUserInfo = await this.userRepository.getUserInfo(
    //       comment.userId,
    //     );
    //     return {
    //       id: comment.id,
    //       userId: comment.userId,
    //       profileImage: commentUserInfo.profileImage,
    //       nickname: commentUserInfo.nickname,
    //       comment: comment.comment,
    //       createdAt: comment.createdAt,
    //     };
    //   }),
    // );
    try {
      this.articleToTagRepository.deleteTags(articleId);
      const tags = await this.findOrCreateTags(user, articleId, tag);
      return {
        data: {
          userInfo,
          articleInfo: {
            ...articleInfo,
            roads,
            tags,
            // comments,
          },
        },
        message: 'article modified',
      };
    } catch {
      this.articleRepository.update(
        { id: articleId },
        { content: articleInfo.content },
      );
      this.articleToTagRepository.deleteTags(articleId);
      lastTags.forEach(({ tagId, order }) => {
        this.articleToTagRepository.save({ tagId, articleId, order });
      });
      throw new BadRequestException('bad request');
    }

    // if (content) {
    //   const isOwner = await this.articleRepository.isOwner(user, articleId)
    //   if (isOwner) {
    //     const result = await this.articleRepository.updateContent(updateArticleDto);
    //     if (!result) {
    //       throw new BadRequestException();
    //     }
    //   }
    // }
    // if (tag) {
    //   // 기존에 있던 태그 전부 삭제
    //   await this.articleToTagRepository.deleteTags(articleId);
    //   // tag를 찾거나 만들어주는 로직으로 Go
    //   const result = await this.findOrCreateTags(user, articleId, tag);
    //   if (result) {
    //     return await this.getResponseData(user, articleId);
    //   }
    // }
  }

  async deleteArticle(id: number) {
    const result = await this.articleRepository.deleteArticle(id);
    return result;
  }
}