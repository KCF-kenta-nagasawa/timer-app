"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";

export default function Home() {
  // プレイヤー人数
  const [playerCount, setPlayerCount] = useState(4);

  // 初期持ち時間（分）
  const [initialMinutes, setInitialMinutes] = useState(10);

  // 各プレイヤーの残り時間（秒）
  const [times, setTimes] = useState<number[]>(
    Array(4).fill(10 * 60)
  );

  // 現在のプレイヤー
  const [currentPlayer, setCurrentPlayer] = useState(0);

  // タイマー
  useEffect(() => {
    const interval = setInterval(() => {
      setTimes((prev) => {
        const next = [...prev];

        if (next[currentPlayer] > 0) {
          next[currentPlayer]--;
        }

        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentPlayer]);

  // 時間表示
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;

    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  // 次のプレイヤー
  const handleNext = () => {
    setCurrentPlayer((prev) =>
      prev === playerCount - 1 ? 0 : prev + 1
    );
  };

  // リセット
  const handleReset = () => {
    setTimes(Array(playerCount).fill(initialMinutes * 60));
    setCurrentPlayer(0);
  };

  // 人数変更
  const handlePlayerCountChange = (count: number) => {
    setPlayerCount(count);
    setTimes(Array(count).fill(initialMinutes * 60));
    setCurrentPlayer(0);
  };

  // 持ち時間変更
  const handleTimeChange = (minutes: number) => {
    setInitialMinutes(minutes);
    setTimes(Array(playerCount).fill(minutes * 60));
    setCurrentPlayer(0);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#F5F7FA",
        px: 3,
        py: 5,
      }}
    >
      {/* タイトル */}
      <Typography
        variant="h3"
        sx={{
          textAlign: "center",
          color: "#102A43",
          fontWeight: 700,
          letterSpacing: "0.25em",
          mb: 4,
        }}
      >
        TIMER
      </Typography>

      {/* 設定 */}
      <Stack
        direction="row"
        spacing={2}
        justifyContent="center"
        sx={{ mb: 4 }}
      >
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
      </Stack>
        
      <Box sx={{ textAlign: "center" }}>
        <Button
          variant="text"
          onClick={handleReset}
          sx={{
            color: "#7B8794",
            fontSize:26,
            fontWeight: 700,
            letterSpacing: "0.2em",
          }}
        >
          RESET
        </Button>
      </Box>
      

      {/* プレイヤー */}
      <Stack
        spacing={3}
        sx={{
          maxWidth: 900,
          mx: "auto",
        }}
      >
        {times.slice(0, playerCount).map((time, index) => {
          const active = currentPlayer === index;

          return (
            <Card
              key={index}
              onClick={() => {
                if (active) {
                  handleNext();
                }
              }}
              sx={{
                p: 4,
                borderRadius: 6,
                bgcolor: active ? "#102A43" : "#FFFFFF",
                color: active ? "#FFFFFF" : "#102A43",
                cursor: active ? "pointer" : "default",
                boxShadow: "0 10px 30px rgba(16,42,67,0.08)",
                transition: ".25s",

                "&:hover": active
                  ? {
                      transform: "translateY(-2px)",
                      boxShadow:
                        "0 20px 50px rgba(16,42,67,0.15)",
                    }
                  : {},
              }}
            >
              <Typography
                sx={{
                  textAlign: "center",
                  fontSize: 20,
                  fontWeight: 600,
                  letterSpacing: "0.2em",
                  opacity: 0.8,
                }}
              >
                PLAYER {index + 1}
              </Typography>

              <Typography
                sx={{
                  mt: 2,
                  textAlign: "center",
                  fontWeight: 700,
                  letterSpacing: "-0.05em",
                  fontSize: {
                    xs: 56,
                    md: 90,
                  },
                }}
              >
                {formatTime(time)}
              </Typography>

              {active && (
                <Typography
                  sx={{
                    mt: 1,
                    textAlign: "center",
                    fontSize: 13,
                    letterSpacing: "0.2em",
                    opacity: 0.7,
                  }}
                >
                  TAP TO PASS
                </Typography>
              )}
            </Card>
          );
        })}

      </Stack>
    </Box>
  );
}