import React from 'react';
import './App.scss';
import Editor from './components/Editor';

class App extends React.Component 
{
  


  render() {
    const s = {
      background:'gray',
    }
    return(
      <div className="App" style = {s}>
        <Editor></Editor>
        {/* <FabricCanvas></FabricCanvas> */}
    </div>
    );
  }
    
}

export default App;
