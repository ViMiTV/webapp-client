import React from 'react';
import logo from './logo.svg';
import { Counter } from './features/counter/Counter';
import './App.css';
import PoseNet from "./components/PoseNet"

function App() {
  return (
    <div className="App">
      <PoseNet />
    </div>
  );
}

export default App;
