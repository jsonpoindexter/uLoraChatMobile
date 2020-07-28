import React from 'react';
import {
  SafeAreaView,
  StatusBar,
} from 'react-native';
import Chat, {MessageObj} from "./components/chat";
import Home from "./views/Home";
declare const global: {HermesInternal: null | {}};

let messages: MessageObj[] = []

const App = () => {
  return (
    <>
      {/*<StatusBar barStyle="dark-content" />*/}
      {/*<SafeAreaView>*/}
          <Home />
        {/*<Chat messageObjs={messages} />*/}
      {/*</SafeAreaView>*/}
    </>
  );
};



export default App;
