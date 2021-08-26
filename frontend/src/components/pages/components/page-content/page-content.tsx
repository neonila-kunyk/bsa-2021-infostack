import { Card, Col, Row, Popover, OverlayTrigger } from 'react-bootstrap';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';
import slug from 'remark-slug';
import isUUID from 'is-uuid';
import { toast } from 'react-toastify';
import {
  useAppDispatch,
  useAppSelector,
  useEffect,
  useState,
  useParams,
  useHistory,
} from 'hooks/hooks';
import { RootState } from 'common/types/types';
import { pagesActions } from 'store/actions';
import { AppRoute, PermissionType } from 'common/enums/enums';
import { pageApi } from 'services';
import { replaceIdParam, getAllowedClasses } from 'helpers/helpers';
import VersionDropdown from '../version-dropdown/version-dropdown';
import { ConfirmModal, InviteModal, Spinner } from 'components/common/common';
import {
  PageTableOfContents,
  PageContributors,
  PageFollowingUsers,
  CommentSection,
  Popup,
  PageActionsDropdown,
} from '../components';
import {
  IPageContent,
  IPageContributor,
  IPageTableOfContents,
  IPageTableOfContentsHeading,
  // IPage,
  IPageNav,
} from 'common/interfaces/pages';
// import { IUser } from 'common/interfaces/user';
import { FollowModal } from '../follow-modal/follow-modal';
import PageTags from '../page-tags/page-tags';
import styles from './styles.module.scss';

export const PageContent: React.FC = () => {
  const { isSpinner } = useAppSelector((state: RootState) => state.pages);
  const { currentPage } = useAppSelector((state: RootState) => state.pages);
  const childPages = useAppSelector((state) => {
    const { pages, currentPage } = state.pages;
    if (pages && currentPage) {
      const page = pages.find((page) => page.id === currentPage.id);
      return page ? page.childPages : null;
    }
  });

  // const followedPages = useAppSelector((state) => {
  //   const { pages, currentPage } = state.pages;
  //   if (pages && currentPage) {
  //     const page = pages.find((page) => page, === currentPage.id);
  //     return page ? page.childPages : null;
  //   }
  // });

  const followedChildPages = useAppSelector((state) => {
    const { user } = state.auth;
    if (user && user.followingPages && childPages) {
      const followedPages = user.followingPages.map((child) => ({
        ...childPages.find((page) => child.id === page.id),
        ...child,
      }));
      return followedPages;
    }
  });

  const { isCurrentPageFollowed } = useAppSelector(
    (state: RootState) => state.pages,
  );
  const { user } = useAppSelector((state) => state.auth);

  // const followedChildPages = useAppSelector((state) => {
  //   const { user } = state.auth;
  //   if (user && user.followingPages) {
  //     const pages = user.followingPages.map((page) => childPages?.filter((childPage) =>
  //     childPage.id === page.id))[0];

  //     return pages;
  //   }
  // });
  // const [user, setUser] = useState<IUser>();

  // const followedChildPages = user?.followingPages ? user?.followingPages.map((page) =>
  //   childPages?.filter((childPage) => childPage.id !== page.id),
  // )[0] : null;

  // const followedChildPages = useAppSelector((state) => {
  //   const { user } = state.auth;
  //   if (user && user.followingPages) {
  //   const followedChildPages = user?.followingPages ? user?.followingPages.map((page) =>
  //   childPages?.filter((childPage) => childPage.id !== page.id))[0] : null;
  //   return followedChildPages;
  //     // const pages = user.followingPages.find((page) =>
  //     // childPages?.filter((childPage) => childPage.id !== page.id));
  //     // const pages = user.followingPages.find((page) => childPages?.filter((childPage) => childPage.id !== page.id),
  //     // return pages;
  //     // return pages ? page.childPages : null;
  //   }
  // });

  const [currContent, setCurrContent] = useState<IPageContent | undefined>();
  const [isPermissionsModalVisible, setIsPermissionsModalVisible] =
    useState(false);
  const [isInviteModalVisible, setIsInviteModalVisible] = useState(false);
  const [isFollowModalVisible, setIsFollowModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isLeftBlockLoading, setIsLeftBlockLoading] = useState(false);
  const [contributors, setContributors] = useState<IPageContributor[]>([]);
  const [TOCHeadings, setTOCHeadings] = useState<IPageTableOfContentsHeading[]>(
    [],
  );

  const [childPagesToFollow, setChildPagesToFollow] = useState<
    IPageNav[] | null | undefined
  >();
  const [childPagesToUnfollow, setChildPagesToUnfollow] = useState<
    IPageNav[] | null | undefined
  >();

  const history = useHistory();
  const dispatch = useAppDispatch();
  const paramsId = useParams<{ id: string }>().id;
  const paramsVersionId = useParams<{ versionId: string }>().versionId;

  const pageTitle = currContent
    ? currContent.title
    : currentPage?.pageContents[0].title || undefined;

  const content = currContent
    ? currContent.content
    : currentPage?.pageContents[0].content || undefined;

  const canView = currentPage?.permission ? true : false;

  const canRead =
    currentPage?.permission === PermissionType.READ ||
    currentPage?.permission === PermissionType.WRITE ||
    currentPage?.permission === PermissionType.ADMIN;

  useEffect(() => {
    // console.info(followedChildPages);

    // const getPagesIds = ({ id, childPages }: IPage): string[] =>
    // childPages ? [id, ...childPages.flatMap(getPagesIds)] : [id];

    // const unfollowedPages = user.followingPages.map((page) =>
    //   childPages?.filter((childPage) => childPage.id !== page.id),
    // );

    //   const unfollowedPages = user.followingPages.map((page) =>
    //   getPagesIds(page),
    // );

    // const followedChildPages = childPages?.map((childPage) =>
    //     user?.followingPages?.filter((page) => page.id !== childPage.id),
    // )[0];

    if (user && user.followingPages && followedChildPages && childPages) {
      // console.info(childPages);
      // console.info(followedChildPages);
      const followedPages = followedChildPages.filter(
        (page) => currentPage?.id === page.parentPageId,
      ) as IPageNav[];
      // const followedPages = childPages.map(child => ({ ...followedIPages.find(page => child.id === page.id) })) as IPageNav[];
      // const followedPages = followedIPages.map(child => ({ ...childPages.find(page => child.id === page.id) }));

      // const followedPages = childPages.map(child => ({ ...followedChildPages.find(page => child.id === page.id), ...child }));

      // const unfollowedPages = childPages.filter(child => !followedPages.includes(child));
      // const unfollowedPages = childPages.filter(child => ({ ...!followedPages.includes(child), ...child }));
      // const unfollowedPages =  childPages.filter(o => !followedPages.some(i=> i.id === o.id));

      // const unfollowedPages =  childPages.filter(o => !followedPages.some(i=> i.id === o.id));
      // const exclude = (arr1, arr2) => arr1.filter(o1 => arr2.map(o2 => o2.foo).indexOf(o1.foo) === -1);
      const unfollowedPages = childPages.filter(
        (o1) => user?.followingPages?.map((o2) => o2.id).indexOf(o1.id) === -1,
      );

      // const unfollowedPages = user?.followingPages.map(page => ({ ...childPages?.find(
      //   childPage => page.id !== childPage.id), ...page }),
      // );

      // const followedPages = user?.followingPages.filter(page => currentPage?.id === page.parentPageId);
      // const unfollowedPages = user?.followingPages.filter(page => currentPage?.id !== page.parentPageId);
      setChildPagesToUnfollow(followedPages);
      setChildPagesToFollow(unfollowedPages);
      console.info(followedPages);
      console.info(unfollowedPages);
    }

    // const unfollowedPages = user?.followingPages.map(page => ({ ...childPages?.find(
    //   childPage => page.id !== childPage.id), ...page }),
    // );

    //   const followedPages =  user.followingPages.map((page) =>
    //   childPages?.filter((childPage) => childPage.id === page.id),
    // );
  }, [user]);

  useEffect(() => {
    if (paramsVersionId) {
      const currentContent = currentPage?.pageContents.find(
        (content) => content.id === paramsVersionId,
      );
      if (currentContent) {
        setCurrContent(currentContent);
      }
    }
  }, [paramsVersionId]);

  // const followedChildPages = childPages ? childPages.map((childPage) =>
  //   user?.followingPages?.filter((page) => page.id === childPage.id),
  // )[0] : null;

  // const childPagesToFollow = user?.followingPages ? user?.followingPages.map((page) =>
  //   childPages?.filter((childPage) => childPage.id !== page.id),
  // )[0] : null;

  // const childPagesToUnfollow = user?.followingPages ? user?.followingPages.map((page) =>
  //   childPages?.filter((childPage) => childPage.id === page.id),
  // )[0] : null;

  // const childPagesToUnfollow = childPages ? childPages.map((childPage) =>
  //   user?.followingPages?.filter((page) => page.id === childPage.id),
  // )[0] : null;

  const getPageById = async (id?: string): Promise<void> => {
    const payload: string | undefined = id;
    if (currentPage && id !== currentPage.id) {
      await dispatch(pagesActions.getPage(payload));
    }
    if (!currentPage) {
      await dispatch(pagesActions.getPage(payload));
    }
    return;
  };

  useEffect(() => {
    if (paramsVersionId) {
      const currentContent = currentPage?.pageContents.find(
        (content) => content.id === paramsVersionId,
      );
      if (currentContent) {
        setCurrContent(currentContent);
      }
    }
  }, [paramsVersionId]);

  useEffect(() => {
    if (paramsId && isUUID.anyNonNil(paramsId)) {
      setIsLeftBlockLoading(true);

      getPageById(paramsId);

      const contributorsPromise = pageApi.getPageContributors(paramsId);
      let TOCPromise: Promise<IPageTableOfContents>;

      if (paramsVersionId) {
        TOCPromise = pageApi.getPageVersionTableOfContents(
          paramsId,
          paramsVersionId,
        );
      } else {
        TOCPromise = pageApi.getPageTableOfContents(paramsId);
      }

      Promise.all([contributorsPromise, TOCPromise]).then(
        ([contributors, TOC]) => {
          setContributors(contributors);
          setTOCHeadings(TOC.headings);
        },
      );

      setIsLeftBlockLoading(false);
    } else {
      dispatch(pagesActions.clearCurrentPage());
      history.push(AppRoute.ROOT);
    }
  }, [paramsId, paramsVersionId]);

  const onAssign = (): void => {
    setIsPermissionsModalVisible(true);
  };

  const handleAssignCancel = (): void => {
    setIsPermissionsModalVisible(false);
  };

  const handleAssignConfirm = (): void => {
    setIsPermissionsModalVisible(false);
    setIsInviteModalVisible(true);
  };

  const handleIviteCancel = (): void => {
    setIsInviteModalVisible(false);
  };

  const onEditing = (): void => {
    history.push(replaceIdParam(AppRoute.CONTENT_SETTING, paramsId || ''));
  };

  const onDelete = (): void => {
    setIsDeleteModalVisible(true);
  };

  const handleDeleteCancel = (): void => {
    setIsDeleteModalVisible(false);
  };

  const handleDeleteConfirm = async (): Promise<void> => {
    if (currentPage) {
      await dispatch(pagesActions.deletePage(currentPage.id));
      history.push(AppRoute.ROOT);
      toast.info('Page has been deleted successfully.', {
        closeOnClick: false,
        pauseOnHover: true,
      });
    }
  };

  const isPageFollowed = async (): Promise<void> => {
    if (currentPage?.followingUsers) {
      currentPage.followingUsers.map((follower) => {
        if (follower.id === user?.id) {
          dispatch(pagesActions.setCurrentPageFollowed(true));
        }
      });
    }
  };

  const handlePageFollow =
    (pageId: string) =>
    async (withChildren: boolean): Promise<void> => {
      setIsFollowModalVisible(false);
      await dispatch(pagesActions.followPage({ pageId, withChildren }));
    };

  const handlePageUnfollow =
    (pageId: string) =>
    async (withChildren: boolean): Promise<void> => {
      setIsFollowModalVisible(false);
      await dispatch(pagesActions.unfollowPage({ pageId, withChildren }));
    };

  const onPageFollow = (): void => {
    // console.info(user?.followingPages, childPagesToUnfollow);
    // console.info(childPages, followedChildPages);
    if (childPages && childPages.length) {
      setIsFollowModalVisible(true);
    } else {
      isCurrentPageFollowed
        ? handlePageUnfollow(paramsId)(false)
        : handlePageFollow(paramsId)(false);
    }

    // const setUpdatedUser = async (): Promise<void> => {
    //   await userApi.getUserInfo(id).then((user) => setUser(user));
    // };

    // setUpdatedUser();
  };

  useEffect(() => {
    isPageFollowed();
  }, [isPageFollowed]);

  if (isSpinner || isLeftBlockLoading) {
    return <Spinner />;
  }

  return (
    <div className="p-4">
      {canView ? (
        <>
          <Row className="gx-5">
            <Col xs={12} lg={3} xl={2}>
              <PageTableOfContents headings={TOCHeadings} />
              <PageTags />
              <PageContributors className="mt-4" contributors={contributors} />
              <PageFollowingUsers
                className="mt-4"
                followers={currentPage?.followingUsers}
              />
            </Col>
            <Col xs={12} lg={9} xl={10}>
              <Row>
                <Col className="d-flex justify-content-between mb-4 align-items-center">
                  <OverlayTrigger
                    trigger="hover"
                    placement="bottom"
                    overlay={
                      <Popover id="popover-positioned-bottom">
                        <Popover.Body
                          className={getAllowedClasses(styles.popoverText)}
                        >
                          {pageTitle || 'New Page'}
                        </Popover.Body>
                      </Popover>
                    }
                  >
                    <h1 className={getAllowedClasses(styles.pageHeading, 'h3')}>
                      {pageTitle || 'New Page'}
                    </h1>
                  </OverlayTrigger>
                  <div className="d-flex align-items-center">
                    {canRead && (
                      <VersionDropdown
                        currContent={currContent}
                        contributors={contributors}
                      />
                    )}

                    <PageActionsDropdown
                      onAssign={onAssign}
                      onEditing={onEditing}
                      onPageFollow={onPageFollow}
                      onDelete={onDelete}
                      isCurrentPageFollowed={isCurrentPageFollowed}
                    />
                  </div>
                </Col>
              </Row>
              <Row className="mb-4">
                <Col>
                  <Card border="light" className={styles.card}>
                    <Card.Body className={getAllowedClasses(styles.content)}>
                      {/* @ts-expect-error see https://github.com/rehypejs/rehype/discussions/63 */}
                      <ReactMarkdown remarkPlugins={[slug, gfm]}>
                        {content?.trim() || 'Empty page'}
                      </ReactMarkdown>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
              <Row>
                <Col>
                  <CommentSection pageId={paramsId} />
                </Col>
              </Row>
            </Col>
          </Row>
          <Popup
            query="Users & Teams"
            isVisible={isPermissionsModalVisible}
            cancelButton={{
              text: 'Cancel',
              onClick: handleAssignCancel,
            }}
            inviteButton={{
              text: 'Add user',
              onClick: handleAssignConfirm,
            }}
          />
          <InviteModal
            onModalClose={handleIviteCancel}
            showModal={isInviteModalVisible}
          />
          <FollowModal
            show={isFollowModalVisible}
            isFollowing={isCurrentPageFollowed}
            // childPages={childPagesToFollow}
            childPages={
              isCurrentPageFollowed ? childPagesToUnfollow : childPagesToFollow
            }
            // childPages={followedChildPages}
            // childPages={childPages}
            // childPages={childPages?.map({ id, }) => }
            handler={
              isCurrentPageFollowed
                ? handlePageUnfollow(paramsId)
                : handlePageFollow(paramsId)
            }
          />
          <ConfirmModal
            title="Delete confirmation"
            showModal={isDeleteModalVisible}
            modalText="Are you sure you want to delete this page? If this page contains subpages they will be deleted as well."
            confirmButton={{
              text: 'Delete',
              onClick: handleDeleteConfirm,
              variant: 'danger',
            }}
            cancelButton={{
              text: 'Close',
              onClick: handleDeleteCancel,
            }}
          />
        </>
      ) : (
        <h1 className="d-flex justify-content-center">
          No permission to view the requested page
        </h1>
      )}
    </div>
  );
};
