"use client";

import { useEffect, useState, useRef } from "react";
import {
  Box,
  Button,
  Card,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";

export default function Home() {
  // =========================
  // 設定
  // =========================
  const [playerCount, setPlayerCount] = useState(4);
  const [initialMinutes, setInitialMinutes] = useState(10);

  // =========================
  // 状態
  // =========================
  const [times, setTimes] = useState<number[]>(Array(4).fill(600));
  const [currentPlayer, setCurrentPlayer] = useState(0);

  const currentPlayerRef = useRef(currentPlayer);

  useEffect(() => {
    currentPlayerRef.current = currentPlayer;
  }, [currentPlayer]);

  // =========================
  // utils
  // =========================
  const isAllZero = (arr: number[]) => arr.every((t) => t === 0);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  // =========================
  // timer
  // =========================
  useEffect(() => {
    const interval = setInterval(() => {
      setTimes((prev) => {
        if (isAllZero(prev)) return prev;

        const next = [...prev];
        const idx = currentPlayerRef.current;

        if (next[idx] > 0) next[idx]--;

        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // =========================
  // auto next
  // =========================
  useEffect(() => {
    if (isAllZero(times)) return;

    const currentTime = times[currentPlayer];
    if (currentTime !== 0) return;

    setCurrentPlayer((prev) => {
      let next = prev + 1;
      if (next >= playerCount) next = 0;
      return next;
    });
  }, [times, currentPlayer, playerCount]);

  // =========================
  // actions
  // =========================
  const handleNext = () => {
    setCurrentPlayer((prev) =>
      prev === playerCount - 1 ? 0 : prev + 1
    );
  };

  const handleReset = () => {
    setTimes(Array(playerCount).fill(initialMinutes * 60));
    setCurrentPlayer(0);
  };

  const handlePlayerCountChange = (count: number) => {
    setPlayerCount(count);
    setTimes(Array(count).fill(initialMinutes * 60));
    setCurrentPlayer(0);
  };

  const handleTimeChange = (minutes: number) => {
    setInitialMinutes(minutes);
    setTimes(Array(playerCount).fill(minutes * 60));
    setCurrentPlayer(0);
  };

  return (
    <Box
      sx={{
        minHeight: "100dvh",
        bgcolor: "#F5F7FA",
        px: 2,
        py: 2,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* =========================
          TITLE（圧縮）
      ========================= */}
      <Typography
        sx={{
          textAlign: "center",
          color: "#102A43",
          fontWeight: 700,
          fontSize: 28,
          letterSpacing: "0.2em",
          mb: 1,
        }}
      >
        TIMER
      </Typography>

      {/* =========================
          SETTINGS（圧縮）
      ========================= */}
      <Box
        sx={{
          display: "flex",
          gap: 1,
          justifyContent: "center",
          mb: 1,
        }}
      >
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>PLAYERS</InputLabel>
          <Select
            value={playerCount}
            label="PLAYERS"
            onChange={(e) =>
              handlePlayerCountChange(Number(e.target.value))
            }
          >
            <MenuItem value={2}>2</MenuItem>
            <MenuItem value={3}>3</MenuItem>
            <MenuItem value={4}>4</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>TIME</InputLabel>
          <Select
            value={initialMinutes}
            label="TIME"
            onChange={(e) =>
              handleTimeChange(Number(e.target.value))
            }
          >
            {[...Array(31)].map((_, i) => (
              <MenuItem key={i} value={i}>
                {i}m
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* RESET（圧縮） */}
      <Box sx={{ textAlign: "center", mb: 1 }}>
        <Button
          onClick={handleReset}
          sx={{
            fontSize: 18,
            fontWeight: 700,
            color: "#7B8794",
            letterSpacing: "0.2em",
          }}
        >
          RESET
        </Button>
      </Box>

      {/* =========================
          CARDS（スマホ最適化核心）
      ========================= */}
      <Box
        sx={{
          width: 280,        // ← 追加（重要）
          mx: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 1,
          flex: 1,
        }}
      >
        {times.slice(0, playerCount).map((time, index) => {
          const active =
            currentPlayer === index && time > 0;

          return (
            <Card
              key={index}
              onClick={() => active && handleNext()}
              sx={{
                p: 1,
                borderRadius: 3,
                minHeight: 80, // ← 縦圧縮の核心
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                bgcolor: active ? "#102A43" : "#fff",
                color: active ? "#fff" : "#102A43",
                transition: ".2s",
              }}
            >
              <Typography
                sx={{
                  textAlign: "center",
                  fontSize: 12,
                  opacity: 0.8,
                  letterSpacing: "0.15em",
                }}
              >
                PLAYER {index + 1}
              </Typography>

              <Typography
                sx={{
                  textAlign: "center",
                  fontSize: 32,
                  fontWeight: 600,
                  lineHeight: 1.1,
                }}
              >
                {formatTime(time)}
              </Typography>

              {active && (
                <Typography
                  sx={{
                    textAlign: "center",
                    fontSize: 10,
                    opacity: 0.7,
                    letterSpacing: "0.15em",
                  }}
                >
                  TAP TO PASS
                </Typography>
              )}
            </Card>
          );
        })}
      </Box>
    </Box>
  );
}