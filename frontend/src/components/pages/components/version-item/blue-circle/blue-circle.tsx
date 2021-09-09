import { getAllowedClasses } from 'helpers';

import styles from './styles.module.scss';

export const BlueCircle: React.FC = () => (
  <span className={getAllowedClasses(styles.dot, 'd-flex')}></span>
);
