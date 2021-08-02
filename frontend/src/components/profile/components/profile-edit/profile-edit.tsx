import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from 'hooks/hooks';
import { Button, Form, Col, Image, Row, Card } from 'react-bootstrap';
import { getAllowedClasses } from '../../../../helpers/dom/get-allowed-classes/get-allowed-classes.helper';
import { authActions } from 'store/actions';
import { RootState } from 'common/types/types';
import { UserApi } from 'services';
import styles from './profile-edit.module.scss';

const ProfileEdit: React.FC = () => {
  const dispatch = useAppDispatch();
  const [isUploading, setIsUploading] = useState(false);
  const [userFullName, setUserFullName] = useState('');
  const [selectedImgURL, setSelectedImgURL] = useState('');
  const [selectedFile, setSelectedFile] = useState<File>();
  const { user } = useSelector((state: RootState) => state.auth);
  const userApi = new UserApi();

  useEffect(() => {
    if (user) {
      setUserFullName(user.fullName);
    }
  }, []);

  const handleSaveChanges = async (): Promise<void> => {
    // eslint-disable-next-line no-console
    console.log(user);
    if (user) {
      if (userFullName !== user.fullName) {
        setIsUploading(true);

        const updatedUser = await userApi
          .update(user.id, { ...user, fullName: userFullName })
          .then((data) => data);
        dispatch(
          authActions.setUser({
            id: updatedUser.id,
            fullName: updatedUser.fullName,
            avatar: updatedUser.avatar,
            email: updatedUser.email,
          }),
        );
        setUserFullName(updatedUser.fullName);
      }

      if (selectedFile) {
        setIsUploading(true);

        const updatedUser = await userApi
          .uploadAvatar(user.id, selectedFile, selectedFile.name)
          .then((data) => data);

        dispatch(
          authActions.setUser({
            id: updatedUser.id,
            fullName: updatedUser.fullName,
            avatar: updatedUser.avatar,
            email: updatedUser.email,
          }),
        );

        setSelectedFile(undefined);
      }

      setIsUploading(false);
    }
  };

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e): void => {
        if (e.target && e.target.result) {
          setSelectedImgURL(e.target.result.toString());
        }
      };
      const selectedFile = e.target.files[0];
      reader.readAsDataURL(selectedFile);
      setSelectedFile(selectedFile);
    }
  };

  return (
    <Card
      className={`${getAllowedClasses(styles.cardItem)} justify-content-center`}
    >
      <Card.Header className={getAllowedClasses(styles.cardHeader)}>
        <Card.Title as="h5" className={getAllowedClasses(styles.cardTitle)}>
          Info
        </Card.Title>
      </Card.Header>
      <Card.Body className={getAllowedClasses(styles.cardBody)}>
        <Row>
          <Col md={8}>
            <Form>
              <Form.Group className="mb-3" controlId="formGroupEmail">
                <Form.Label
                  className={getAllowedClasses(styles.cardInputLabel)}
                >
                  Email address
                </Form.Label>
                <Form.Control
                  className={getAllowedClasses(styles.cardInput)}
                  type="email"
                  placeholder="Enter email"
                  value={user ? user.email : ''}
                  disabled
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formGroupPassword">
                <Form.Label
                  className={getAllowedClasses(styles.cardInputLabel)}
                >
                  Full name
                </Form.Label>
                <Form.Control
                  className={getAllowedClasses(styles.cardInput)}
                  type="text"
                  placeholder="Full name"
                  value={userFullName}
                  onChange={(e): void => setUserFullName(e.target.value)}
                />
              </Form.Group>
            </Form>
          </Col>
          <Col
            md={4}
            className="d-flex text-center flex-column align-items-center"
          >
            <Image
              src={user && !selectedImgURL ? user.avatar : selectedImgURL}
              roundedCircle
              className={`${getAllowedClasses(styles.cardImage)} mb-3`}
            />
            <label
              className={`${getAllowedClasses(
                styles.cardButton,
                styles.uploadLabel,
              )} mb-3`}
            >
              <i
                className={`bi bi-cloud-arrow-up-fill ${getAllowedClasses(
                  styles.uploadIcon,
                )}`}
              ></i>
              &nbsp; Upload
              <input
                type="file"
                onChange={handleFileSelected}
                name="image"
                hidden
              />
            </label>
            <span className={getAllowedClasses(styles.uploadText)}>
              For best results use an image at least 128px in .jpg format
            </span>
          </Col>
        </Row>{' '}
        <Button
          variant="primary"
          className={getAllowedClasses(styles.cardButton)}
          size="sm"
          onClick={!isUploading ? handleSaveChanges : undefined}
          disabled={isUploading}
        >
          {isUploading ? 'Uploading…' : 'Save changes'}
        </Button>
      </Card.Body>
    </Card>
  );
};

export default ProfileEdit;
