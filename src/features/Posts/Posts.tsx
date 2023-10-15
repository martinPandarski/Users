import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Typography, Stack } from "@mui/material";

import {
  useDeleteUserPostMutation,
  useUserPostsQuery,
} from "../../app/services/posts";
import { useGetUserInfoQuery } from "../../app/services/users";
import { validArray, validNumber } from "../../utils";

import UserCard from "./UserCard";
import EditPost from "./EditPost";
import PostListItem from "./PostListItem";
import ConfirmDeletePost from "./ConfirmDeletePost";

type ModalStates = {
  confirmModal: boolean;
  editPostModal: boolean;
};

const initialModalsState: ModalStates = {
  confirmModal: false,
  editPostModal: false,
};

const Posts: React.FC = () => {
  const {
    state: { userId },
  } = useLocation();
  const [modalsState, setModalsState] = useState(initialModalsState);
  const [selectedPostId, setSelectedPostId] = useState<number>(0);

  const { data: userPosts } = useUserPostsQuery(userId);
  const { data: userInfo } = useGetUserInfoQuery(userId);
  const [deletePost, { isLoading: deletePostLoading, originalArgs }] =
    useDeleteUserPostMutation();

  const toggleModal = (modalName: keyof ModalStates) => {
    setModalsState((prevState) => ({
      ...prevState,
      [modalName]: !prevState[modalName],
    }));
  };

  const handleEditPost = (id: number) => {
    setSelectedPostId(id);
    toggleModal("editPostModal");
  };

  const handleDeleteConfirmation = (id: number) => {
    setSelectedPostId(id);
    toggleModal("confirmModal");
  };

  const handleDelete = async () => {
    if (validNumber(selectedPostId)) {
      try {
        await deletePost(selectedPostId);
        toggleModal("confirmModal");
      } catch (_err) {
        return;
      }
    }
  };

  return (
    <Stack direction="column" spacing={1} marginTop={2}>
      {userInfo && <UserCard userInfo={userInfo} />}
      {validArray(userPosts) ? (
        userPosts?.map((post) => (
          <PostListItem
            key={post.id}
            post={post}
            isDeleting={deletePostLoading && originalArgs === post.id}
            onEdit={handleEditPost}
            onDelete={handleDeleteConfirmation}
          />
        ))
      ) : (
        <Typography>No posts from this user</Typography>
      )}
      <EditPost
        handleClose={() => toggleModal("editPostModal")}
        open={modalsState.editPostModal}
        postId={selectedPostId}
      />
      <ConfirmDeletePost
        open={modalsState.confirmModal}
        handleClose={() => toggleModal("confirmModal")}
        handleSubmit={handleDelete}
      />
    </Stack>
  );
};

export default Posts;
