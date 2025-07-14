import './App.css';
import React from 'react';
import Index2 from './Components/Index2.js';
import DeepState from './context/DeepState';

function App() {
  return (
    <>
      <DeepState>
        <Index2 />
      </DeepState>
    </>
  );
}

export default App;