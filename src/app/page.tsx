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

  // 最新のcurrentPlayerを保持（setIntervalズレ防止）
  const currentPlayerRef = useRef(currentPlayer);

  useEffect(() => {
    currentPlayerRef.current = currentPlayer;
  }, [currentPlayer]);

  // =========================
  // 全員0判定
  // =========================
  const isAllZero = (arr: number[]) => arr.every((t) => t === 0);

  // =========================
  // タイマー
  // =========================
  useEffect(() => {
    const interval = setInterval(() => {
      setTimes((prev) => {
        if (isAllZero(prev)) return prev;

        const next = [...prev];
        const idx = currentPlayerRef.current;

        if (next[idx] > 0) {
          next[idx] -= 1;
        }

        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // =========================
  // 0になったら次へ（安定版）
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
  // 表示フォーマット
  // =========================
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  // =========================
  // 手動切り替え
  // =========================
  const handleNext = () => {
    setCurrentPlayer((prev) =>
      prev === playerCount - 1 ? 0 : prev + 1
    );
  };

  // =========================
  // リセット
  // =========================
  const handleReset = () => {
    setTimes(Array(playerCount).fill(initialMinutes * 60));
    setCurrentPlayer(0);
  };

  // =========================
  // プレイヤー数変更
  // =========================
  const handlePlayerCountChange = (count: number) => {
    setPlayerCount(count);
    setTimes(Array(count).fill(initialMinutes * 60));
    setCurrentPlayer(0);
  };

  // =========================
  // 時間変更
  // =========================
  const handleTimeChange = (minutes: number) => {
    setInitialMinutes(minutes);
    setTimes(Array(playerCount).fill(minutes * 60));
    setCurrentPlayer(0);
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#F5F7FA", px: 3, py: 5 }}>
      {/* タイトル */}
      <Typography
        variant="h4"
        sx={{
          textAlign: "center",
          color: "#102A43",
          fontWeight: 700,
          letterSpacing: "0.25em",
          mb:1.5,
        }}
      >
        TIMER
      </Typography>

      {/* 設定 */}
      <Box sx={{ display: "flex", gap: 2, justifyContent: "center", mb: 2 }}>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>PLAYERS</InputLabel>
          <Select
            value={playerCount}
            label="PLAYERS"
            onChange={(e) =>
              handlePlayerCountChange(Number(e.target.value))
            }
          >
            <MenuItem value={2}>2 Players</MenuItem>
            <MenuItem value={3}>3 Players</MenuItem>
            <MenuItem value={4}>4 Players</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>TIME</InputLabel>
          <Select
            value={initialMinutes}
            label="TIME"
            onChange={(e) =>
              handleTimeChange(Number(e.target.value))
            }
          >
            {[...Array(61)].map((_, i) => (
              <MenuItem key={i} value={i}>
                {i} min
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* RESET */}
      <Box sx={{ textAlign: "center" }}>
        <Button
          onClick={handleReset}
          sx={{ fontSize: 24, fontWeight: 700 }}
        >
          RESET
        </Button>
      </Box>

      {/* プレイヤー */}
      <Box sx={{ maxWidth: 400, mx: "auto", mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
        {times.slice(0, playerCount).map((time, index) => {
          const active =
            currentPlayer === index && time > 0; // ←チラつき防止の核心

          return (
            <Card
              key={index}
              onClick={() => active && handleNext()}
              sx={{
                p: 1,
                borderRadius: 6,
                bgcolor: active ? "#102A43" : "#fff",
                color: active ? "#fff" : "#102A43",
                cursor: active ? "pointer" : "default",
                transition: ".2s",
              }}
            >
              <Typography sx={{ textAlign: "center" }}>
                PLAYER {index + 1}
              </Typography>

              <Typography sx={{ textAlign: "center", fontSize: 40 }}>
                {formatTime(time)}
              </Typography>

              {active && (
                <Typography sx={{ textAlign: "center", fontSize: 12 }}>
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