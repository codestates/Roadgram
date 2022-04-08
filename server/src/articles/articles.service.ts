import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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
    @InjectRepository(LikesRepository)
    private likesRepository: LikesRepository,
  ) {}

  async getMain(user: number, page: number): Promise<object> {
    const getFollowing = await this.followRepository.getFollowingIds(user);
    if (!getFollowing) {
      throw new UnauthorizedException('permisson denied');
    } else if (getFollowing.length === 0) {
      throw new NotFoundException('cannot find articles');
    }

    const newArticles = [];
    let limit: number = 9;
    let offset: number = (page - 1) * 9;
    const articles = await this.articleRepository.getArticleInfo(
      getFollowing,
      limit,
      offset,
    );

    if (!articles || articles.length === 0) {
      const error = new NotFoundException('cannot find articles');
      return error;
    }

    try {
      for (const article of articles) {
        const userId: number = await this.articleRepository.getUserId(
          article.id,
        );
        const writer: string = await this.userRepository.getUsername(userId);
        const profileImage: string = await this.userRepository.getProfileImage(
          userId,
        );
        const tagIds: number[] = await this.articleToTagRepository.getTagIds(
          article.id,
        );
        let tagNames: string[] = [];

        for (const tagId of tagIds) {
          const tagName: string = await this.tagRepository.getTagNameWithIds(
            tagId,
          );
          tagNames.push(tagName);
        }
        article.tags = tagNames;

        interface articleObject {
          id: string;
          userId: number;
          thumbnail: string;
          nickname: string;
          profileImage: string;
          totalLike: number;
          totalComment: number;
          tags: string[];
        }

        let creation: articleObject = {
          id: article.id,
          userId: userId,
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
      throw new NotFoundException('Not Found Articles Contents');
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

    if (!articles || articles.length === 0) {
      const error = new NotFoundException('cannot find articles');
      return error;
    }

    let newArticles = [];

    try {
      for (const article of articles) {
        const userId: number = await this.articleRepository.getUserId(
          article.id,
        );
        const writer: string = await this.userRepository.getUsername(userId);
        const profileImage: string = await this.userRepository.getProfileImage(
          userId,
        );
        const tagIds: number[] = await this.articleToTagRepository.getTagIds(
          article.id,
        );
        let tagNames: string[] = [];

        for (const tagId of tagIds) {
          const tagName: string = await this.tagRepository.getTagNameWithIds(
            tagId,
          );
          tagNames.push(tagName);
        }
        article.tags = tagNames;

        interface articleObject {
          id: string;
          userId: number;
          thumbnail: string;
          nickname: string;
          profileImage: string;
          totalLike: number;
          totalComment: number;
          tags: string[];
        }

        let creation: articleObject = {
          id: article.id,
          userId: userId,
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
      throw new NotFoundException('Not Found Articles Contents');
    }
  }

  async findOrCreateTags(
    articleId: number,
    tag: [] | object[],
  ): Promise<string[]> {
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
    } catch (err) {
      throw new NotFoundException('Not Found Tags');
    }
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
      const tagList = await this.findOrCreateTags(articleId, tag);
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
    const articleInfo = await this.articleRepository.getArticleDetail(id);
    if (!articleInfo)
      throw new NotFoundException(`Not Found The Article's Contents`);

    const userInfo = await this.userRepository.getUserInfo(articleInfo.userId);
    if (!userInfo) throw new NotFoundException(`Not Found User's Information`);

    const likedOrNot = await this.likesRepository.likeOrNot(
      user || undefined,
      id,
    );
    const tagIds = await this.articleToTagRepository.getTagIds(articleInfo.id);
    if (!tagIds || tagIds.length === 0)
      throw new NotFoundException(`Not Found Tags`);

    let tagNames = [];
    for (let tagId of tagIds) {
      const tagName: string = await this.tagRepository.getTagNameWithIds(tagId);
      tagNames.push(tagName);
    }

    const roads = await this.trackRepository.getRoads(articleInfo.id);
    if (!roads || roads.length === 0)
      throw new NotFoundException(`Not Found Article's Roads`);
    let article = {};
    article = {
      id: articleInfo.id,
      thumbnail: articleInfo.thumbnail,
      content: articleInfo.content,
      totalLike: articleInfo.totalLike,
      totalComment: articleInfo.totalComment,
      likedOrNot: likedOrNot,
      createdAt: articleInfo.createdAt,
      tags: tagNames,
      roads,
    };

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
  }

  async updateArticle(updateArticleDto: UpdateArticleDto): Promise<any> {
    const { user, articleId, content, tag } = updateArticleDto;

    const articleInfo = await this.articleRepository.findOne({
      where: { id: articleId },
      select: ['id', 'content', 'totalComment', 'totalLike', 'userId'],
    });
    if (!articleInfo)
      throw new NotFoundException(`Not Found Article's Contents`);

    if (user !== articleInfo.userId)
      throw new ForbiddenException('permission denied');

    if (articleInfo.content !== content)
      this.articleRepository.update({ id: articleId }, { content });

    const userInfo = await this.userRepository.findOne({
      where: { id: user },
      select: ['id', 'nickname', 'profileImage'],
    });
    if (!userInfo) {
      this.articleRepository.update(articleId, {content: articleInfo.content});
      throw new NotFoundException('Not Found User Information');
    }

    const lastTags: Array<any> = await this.articleToTagRepository.find({
      where: { articleId },
      select: ['tagId', 'order'],
    });
    if (!lastTags || lastTags.length === 0) {
      this.articleRepository.update(articleId, {
        content: articleInfo.content,
      });
      throw new NotFoundException('Not Found Tags');
    }

    const roads = await this.trackRepository.getRoads(articleId);
    if (!roads || roads.length === 0) {
      this.articleRepository.update(articleId, {content: articleInfo.content});
      throw new NotFoundException(`Not Found Article's Roads`);
    }

    const deleteTagsResult = await this.articleToTagRepository.deleteTags(articleId);
    if(!deleteTagsResult) {
      this.articleToTagRepository.deleteTags(articleId)
      this.articleRepository.update(articleId, {content: articleInfo.content});
      lastTags.forEach(({ tagId, order }) => {
        this.articleToTagRepository.save({ tagId, articleId, order });
      });
      throw new BadRequestException('Bad Request, A Task was cancelled');
    }
    
    const findOrCreateTagsResult = await this.findOrCreateTags(articleId, tag);
    if(!findOrCreateTagsResult) {
      this.articleToTagRepository.deleteTags(articleId)
      this.articleRepository.update(articleId, {content: articleInfo.content});
      lastTags.forEach(({ tagId, order }) => {
        this.articleToTagRepository.save({ tagId, articleId, order });
      });
      throw new BadRequestException('Bad Request, A Task was cancelled');
    }
    return {
      data: {
        userInfo,
        articleInfo: {
          ...articleInfo,
          roads,
        },
      },
      message: 'article modified',
    }; 
  }

  async deleteArticle(id: number) {
    const result = await this.articleRepository.deleteArticle(id);
    if (!result) {
      throw new NotFoundException('Not Found Article you wanted to delete');
    } else {
      return {
        message: 'article deleted',
      };
    }
  }
}
