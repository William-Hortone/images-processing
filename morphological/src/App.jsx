import "./App.css";
import Morphological from "./assets/components/Morphological";

function App() {
  return (
    <>
      <div className="w-full h-screen flex flex-col items-center p-8 gap-8 bg-slate-300 ">
        <h1 className="text-3xl font-bold underline">
          Morphological Image Processing
        </h1>
        <h2 className="text-3xl font-bold ">Student ID: 24SF51042</h2>
        <Morphological />
      </div>
    </>
  );
}

export default App;
