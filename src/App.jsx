import { useState } from 'react'
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Game from './pages/Game';
import Result from './pages/Result';

function App() {
    return (
        <Routes>
            <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/game" element={<Game />} />
                <Route path="/result" element={<Result />} />
            </Route>
        </Routes>
    );
}

export default App;
