import { api } from "./api";

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    };
  };
  phone: string;
  website: string;
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
}
export type EditUserPayload = Partial<User> & Required<Pick<User, "id">>;

type UsersResponse = User[];

export const usersApi = api.injectEndpoints({
  endpoints: (build) => ({
    getUserList: build.query<UsersResponse, void>({
      query: () => "users",
    }),
    getUserInfo: build.query<User, number>({
      query: (userId) => `users/${userId}`,
    }),
    updateUser: build.mutation<EditUserPayload, EditUserPayload>({
      query: (body) => {
        const { id, ...rest } = body;
        return {
          url: `users/${id}`,
          method: "PUT",
          body: rest,
        };
      },
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const updatedUser = { ...data };
          const updatedUserId = data.id;
          dispatch(
            usersApi.util.updateQueryData(
              "getUserList",
              undefined,
              (draftUsers: UsersResponse) => {
                const findMyUserIndex = draftUsers.findIndex(
                  (u) => u.id === updatedUserId
                );
                if (findMyUserIndex !== -1) {
                  Object.assign(draftUsers[findMyUserIndex], updatedUser);
                }
                return draftUsers;
              }
            )
          );
        } catch (_err) {
          return;
        }
      },
    }),
  }),
});

export const {
  useGetUserInfoQuery,
  useGetUserListQuery,
  useUpdateUserMutation,
} = usersApi;
