import React, { useState, useEffect, useRef } from "react";
import "./App.css";

const Pong = () => {
  const canvasRef = useRef(null);
  const [leftPaddleY, setLeftPaddleY] = useState(250);
  const [rightPaddleY, setRightPaddleY] = useState(250);
  const [ball, setBall] = useState({ x: 400, y: 300, dx: 5, dy: 5 });
  const [paused, setPaused] = useState(false);
  const [score, setScore] = useState({ left: 0, right: 0 });

  const paddleHeight = 100;
  const paddleWidth = 10;
  const ballRadius = 10;
  const paddleSpeed = 50;

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Fundo
    ctx.fillStyle = "#161616";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Barras
    ctx.fillStyle = "#00ffff";
    ctx.fillRect(0, leftPaddleY, paddleWidth, paddleHeight);
    ctx.fillRect(canvas.width - paddleWidth, rightPaddleY, paddleWidth, paddleHeight);

    // Bola
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#00ffff";
    ctx.fill();

    // Pontuação
    ctx.font = "32px Arial";
    ctx.fillStyle = "#00ffff";
    ctx.textAlign = "center";
    ctx.fillText(`${score.left} - ${score.right}`, canvas.width / 2, 40);
  };

  const updateGame = () => {
    if (paused) return;

    // Atualização da bola
    let newBall = { ...ball };
    newBall.x += ball.dx;
    newBall.y += ball.dy;

    // Colisão com bordas horizontais
    if (newBall.y - ballRadius < 0 || newBall.y + ballRadius > 600) {
      newBall.dy *= -1;
    }

    // Colisão com barras
    if (
      newBall.x - ballRadius <= paddleWidth &&
      newBall.y > leftPaddleY &&
      newBall.y < leftPaddleY + paddleHeight
    ) {
      newBall.dx *= -1.2;
    }

    if (
      newBall.x + ballRadius >= 800 - paddleWidth &&
      newBall.y > rightPaddleY &&
      newBall.y < rightPaddleY + paddleHeight
    ) {
      newBall.dx *= -1.2;
    }

    // Pontuação
    if (newBall.x - ballRadius < 0) {
      setScore((prev) => ({ ...prev, right: prev.right + 1 }));
      resetBall();
      return;
    } else if (newBall.x + ballRadius > 800) {
      setScore((prev) => ({ ...prev, left: prev.left + 1 }));
      resetBall();
      return;
    }

    setBall(newBall);
  };

  const resetBall = () => {
    setBall({ x: 400, y: 300, dx: 5, dy: 5 });
    setPaused(true);
  };

  const movePaddles = (key) => {
    if (key === "w" && leftPaddleY > 0) setLeftPaddleY((prev) => prev - paddleSpeed);
    if (key === "s" && leftPaddleY < 600 - paddleHeight) setLeftPaddleY((prev) => prev + paddleSpeed);
    if (key === "ArrowUp" && rightPaddleY > 0) setRightPaddleY((prev) => prev - paddleSpeed);
    if (key === "ArrowDown" && rightPaddleY < 600 - paddleHeight) setRightPaddleY((prev) => prev + paddleSpeed);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === " ") setPaused(!paused);
      if (e.key === "Enter") {
        setScore({ left: 0, right: 0 });
        resetBall();
      }
      movePaddles(e.key);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [paused, leftPaddleY, rightPaddleY]);

  useEffect(() => {
    const interval = setInterval(() => {
      updateGame();
      drawCanvas();
    }, 1000 / 60);

    return () => clearInterval(interval);
  });

  return <canvas ref={canvasRef} width="800" height="600"></canvas>;
};

export default Pong;
