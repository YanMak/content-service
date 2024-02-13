// eslint-disable-next-line @typescript-eslint/no-unused-vars
import styles from './app.module.css';

import NxWelcome from './nx-welcome';

import { Route, Routes, Link } from 'react-router-dom';
import ImageSpa from '../components/image-spa';

export function App() {
  return (
    <div>
      <ImageSpa />
    </div>
  );
}

export default App;
