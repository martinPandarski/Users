import { api } from "./api";

export interface UserPost {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export type UserPostPayload = Partial<UserPost> &
  Required<Pick<UserPost, "id">>;

type UserPostsResponse = UserPost[];

export const postsApi = api.injectEndpoints({
  endpoints: (build) => ({
    userPosts: build.query<UserPostsResponse, number>({
      query: (userId) => `posts/?userId=${userId}`,
      providesTags: ["Posts"],
    }),
    getPost: build.query<UserPostsResponse, number>({
      query: (postId) => `posts/?id=${postId}`,
    }),
    editUserPost: build.mutation<UserPost, UserPostPayload>({
      query: (body) => {
        const { id } = body;
        return {
          url: `posts/${id}`,
          method: "PUT",
          body,
        };
      },
      invalidatesTags: ["Posts"],
    }),
    deleteUserPost: build.mutation<void, number>({
      query: (id) => ({
        url: `posts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Posts"],
    }),
  }),
});

export const {
  useUserPostsQuery,
  useEditUserPostMutation,
  useDeleteUserPostMutation,
  useGetPostQuery,
} = postsApi;
