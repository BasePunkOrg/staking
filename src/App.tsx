import Navbar from "./components/views/Navbar";
import Home from "./components/views/Home";
import Footer from "./components/views/Footer";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Admin from "./components/views/Admin";
import "./App.css";
import { WagmiConfig, createConfig, configureChains, mainnet } from "wagmi";
import { publicProvider } from "wagmi/providers/public";

const { publicClient, webSocketPublicClient } = configureChains(
  [mainnet],
  [publicProvider()]
);

const config = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
});





const App = () => {
  return (
    <>
      <WagmiConfig config={config}>
          <BrowserRouter>
              <Navbar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/admin" element={<Admin />} />
              </Routes>
            </BrowserRouter>
            <Footer /> 
       </WagmiConfig> 
    </>
  );
};

export default App;
 