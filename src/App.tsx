import { useState } from "react";
import { AudioGame } from "./components/AudioGame";
import { HomeScreen } from "./components/HomeScreen";

function App() {
  const [started, setStarted] = useState(false);

  if (!started) {
    return <HomeScreen onPlay={() => setStarted(true)} />;
  }

  return <AudioGame onHome={() => setStarted(false)} />;
}

export default App;
