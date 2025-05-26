
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import BotConfig from "./pages/BotConfig";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentSelection from "./pages/PaymentSelection";
import "./App.css";
import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/bot-config" element={<BotConfig />} />
        <Route path="/payment-selection" element={<PaymentSelection />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
