import {
  InputGroup,
  FormControl,
  Button,
  Card,
  Col,
  Row,
} from 'react-bootstrap';
import * as Y from 'yjs';
import Quill from 'quill';
import { useQuill } from 'react-quilljs';
import QuillCursors from 'quill-cursors';
import { WebrtcProvider } from 'y-webrtc';
import { QuillBinding } from 'y-quill';
import TurndownService from 'turndown';
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
import { useState, useEffect } from 'hooks/hooks';
import { getAllowedClasses } from 'helpers/helpers';

import 'quill/dist/quill.snow.css';
import styles from './styles.module.scss';

interface Props {
  userName: string | undefined;
  title: string | undefined;
  content: string | undefined;
  handleSaveConfirm(
    title: string | undefined,
    content: string | undefined,
  ): void;
  handleCancel(): void;
  url: string;
}

export const CollabEditor: React.FC<Props> = ({
  userName,
  title,
  content,
  handleSaveConfirm,
  handleCancel,
  url,
}) => {
  const [titleInput, setTitleInput] = useState(title);
  const [contentInput, setContentInput] = useState('');

  Quill.register('modules/cursors', QuillCursors);

  const { quill, quillRef } = useQuill({
    modules: {
      cursors: {
        transformOnTextChange: true,
      },
      syntax: {
        highlight: (text: string) => hljs.highlightAuto(text).value,
      },
      toolbar: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'strike'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        ['blockquote', 'code-block'],
        ['image', 'link'],
      ],
    },
    formats: [
      'header',
      'font',
      'size',
      'bold',
      'italic',
      'strike',
      'blockquote',
      'list',
      'bullet',
      'indent',
      'link',
      'image',
      'code-block',
    ],
  });
  const ydoc = new Y.Doc();

  const onSave = (): void => {
    const turndownService = new TurndownService();
    const markdown = turndownService.turndown(contentInput);
    handleSaveConfirm(titleInput, markdown);
  };

  const onCancel = (): void => {
    handleCancel();
  };

  useEffect(() => {
    if (quill) {
      const provider = new WebrtcProvider(`wss://${url}`, ydoc);

      provider.connect();
      const yQuillTextYtype = ydoc.getText('quill');
      new QuillBinding(yQuillTextYtype, quill, provider?.awareness);

      provider.awareness.setLocalStateField('user', {
        name: userName,
        color: 'blue',
      });

      provider.awareness.setLocalStateField('quillSettings', {
        isInputSet: false,
      });

      provider.awareness.setLocalStateField('quillSettings', {
        isInputSet: false,
      });

      provider.awareness.getStates().forEach((state) => {
        if (!state.quillSettings.isInputSet) {
          const md = new MarkdownIt();
          const result = md.render(content || '');
          quill.clipboard.dangerouslyPasteHTML(result);

          provider.awareness.setLocalStateField('quillSettings', {
            isInputSet: true,
          });
        }
      });

      quill.on('text-change', () => {
        const html = quill.root.innerHTML;
        setContentInput(html);
      });
    }
  }, [quill]);

  const onInputChange = ({
    target,
  }: React.ChangeEvent<HTMLInputElement>): void => {
    setTitleInput(target.value);
  };

  return (
    <>
      <Row className="mb-4">
        <Col className="d-flex justify-content-between">
          <InputGroup>
            <FormControl value={titleInput} onChange={onInputChange} />
          </InputGroup>
        </Col>
      </Row>
      <Row className="mb-4">
        <Col>
          <Card border="light" className={getAllowedClasses(styles.content)}>
            <div className={getAllowedClasses(styles.editor)}>
              <div ref={quillRef} />
            </div>
          </Card>
        </Col>
      </Row>
      <Row className="mb-4">
        <Col>
          <Button onClick={onSave} variant="success" size="sm" className="me-3">
            Save
          </Button>
          <Button onClick={onCancel} variant="warning" size="sm">
            Cancel
          </Button>
        </Col>
      </Row>
    </>
  );
};
