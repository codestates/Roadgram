// import { JwtModule } from '@nestjs/jwt';
// import { Test, TestingModule } from '@nestjs/testing';
// import { CommentRepository } from 'src/comments/repositories/comments.repository';
// import { FollowRepository } from 'src/follow/repositories/follow.repository';
// import { LikesRepository } from 'src/likes/repositories/likes.repository';
// import { UserRepository } from 'src/users/repositories/user.repository';
// import { UsersService } from 'src/users/users.service';
// import { ArticlesController } from './articles.controller';
// import { ArticlesService } from './articles.service';
// import { ArticleRepository } from './repositories/article.repository';
// import { ArticleToTagRepository } from './repositories/article_tag.repository';
// import { TagRepository } from './repositories/tag.repository';
// import { TrackRepository } from './repositories/track.repository';

// // jest.mock('../articles.service');

const mockArticlesService = () => ({
  getMain: jest.fn(),
  getRecent: jest.fn(),
  findOrCreateTags: jest.fn(),
  createArticle: jest.fn(),
  gietArticleDetail: jest.fn(),
  updateArticle: jest.fn(),
  deleteArticle: jest.fn
})

// describe('ArticlesController', () => {
//   let controller: ArticlesController;
//   let service: ArticlesService;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       controllers: [ArticlesController],
//       providers: [
//         ArticlesService,
//         ArticleRepository,
//         TrackRepository,
//         TagRepository,
//         ArticleToTagRepository,
//         UserRepository,
//         FollowRepository,
//         CommentRepository,
//         LikesRepository,
//         UsersService,
//       ],
//       imports: [
//         JwtModule.register({ secret: process.env.JWT_SECRET })
//       ]
//     }).compile();

//     controller = module.get<ArticlesController>(ArticlesController);
//     service = module.get<ArticlesService>(ArticlesService);
//   });

//   // it('should be defined', () => {
//   //   expect(controller).toBeDefined();
//   // });

//   // it('1. getMain Test', () => {
//   //   jest.spyOn(controller, "getMain")
//   //   controller.getMain(user, page).mockResolved;
//   //   expect(service.getMain).toBeCalledTimes(1);
//   // });
// });