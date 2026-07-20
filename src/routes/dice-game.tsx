import { useCallback, useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  BarChart3,
  ChevronDown,
  ChevronUp,
  CircleDollarSign,
  Dice5,
  FileText,
  History,
  Play,
  RefreshCw,
  Sparkles,
  Trophy,
  Users,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/dice-game")({
  component: DiceGamePage,
});

type Player = {
  id: string;
  name: string;
  gender: "male" | "female";
  dice1: number;
  dice2: number;
  total: number;
  isEliminated: boolean;
  hasRolled: boolean;
  prizeMoney: number;
};

type RoundRecord = {
  round: number;
  players: Array<Pick<Player, "id" | "name" | "dice1" | "dice2" | "total"> & { rank: number }>;
  eliminated: string[];
  message: string;
  timestamp: number;
  rewardAmount: number;
  winnerId: string | null;
};

type PlayerStats = {
  playerId: string;
  playerName: string;
  firstPlace: number;
  secondPlace: number;
  thirdPlace: number;
  fourthPlace: number;
  totalGames: number;
  totalPrizeMoney: number;
};

type GamePhase = "input-reward" | "rolling" | "result";

type GameState = {
  players: Player[];
  round: number;
  winner: Player | null;
  message: string;
  history: RoundRecord[];
  playerStats: Record<string, PlayerStats>;
  phase: GamePhase;
  rewardAmount: number | null;
};

const STORAGE_KEY = "tsaDiceGameState";

const INITIAL_PLAYERS: Player[] = [
  { id: "1", name: "刁小龙", gender: "male", dice1: 0, dice2: 0, total: 0, isEliminated: false, hasRolled: false, prizeMoney: 0 },
  { id: "2", name: "苏小婵", gender: "female", dice1: 0, dice2: 0, total: 0, isEliminated: false, hasRolled: false, prizeMoney: 0 },
  { id: "3", name: "郭大鹏", gender: "male", dice1: 0, dice2: 0, total: 0, isEliminated: false, hasRolled: false, prizeMoney: 0 },
  { id: "4", name: "王小伟", gender: "male", dice1: 0, dice2: 0, total: 0, isEliminated: false, hasRolled: false, prizeMoney: 0 },
];

const PLAYER_SKIN: Record<string, {
  gradient: string;
  ring: string;
  text: string;
  avatar: string;
  avatarBg: string;
  star: string;
}> = {
  "1": {
    gradient: "from-orange-500 to-amber-300",
    ring: "border-orange-400/60",
    text: "text-orange-200",
    avatar: "刁",
    avatarBg: "bg-[radial-gradient(circle_at_35%_28%,#fff7ed_0%,#fb923c_27%,#7c2d12_64%,#111827_100%)]",
    star: "text-orange-400",
  },
  "2": {
    gradient: "from-fuchsia-500 to-pink-400",
    ring: "border-fuchsia-400/70",
    text: "text-pink-200",
    avatar: "苏",
    avatarBg: "bg-[radial-gradient(circle_at_34%_28%,#fdf4ff_0%,#e879f9_28%,#7e22ce_64%,#111827_100%)]",
    star: "text-pink-400",
  },
  "3": {
    gradient: "from-orange-500 to-yellow-300",
    ring: "border-orange-300/70",
    text: "text-sky-200",
    avatar: "郭",
    avatarBg: "bg-[radial-gradient(circle_at_34%_28%,#fff7ed_0%,#f97316_28%,#1d4ed8_62%,#111827_100%)]",
    star: "text-orange-400",
  },
  "4": {
    gradient: "from-sky-500 to-cyan-300",
    ring: "border-sky-300/70",
    text: "text-blue-200",
    avatar: "王",
    avatarBg: "bg-[radial-gradient(circle_at_36%_25%,#f0f9ff_0%,#60a5fa_28%,#7c3aed_64%,#111827_100%)]",
    star: "text-sky-300",
  },
};

const initPlayerStats = (): Record<string, PlayerStats> =>
  Object.fromEntries(
    INITIAL_PLAYERS.map((player) => [
      player.id,
      {
        playerId: player.id,
        playerName: player.name,
        firstPlace: 0,
        secondPlace: 0,
        thirdPlace: 0,
        fourthPlace: 0,
        totalGames: 0,
        totalPrizeMoney: 0,
      },
    ])
  );

const createInitialState = (): GameState => ({
  players: INITIAL_PLAYERS.map((player) => ({ ...player })),
  round: 1,
  winner: null,
  message: "请输入本次奖励金额",
  history: [],
  playerStats: initPlayerStats(),
  phase: "input-reward",
  rewardAmount: null,
});

const rollDice = () => Math.floor(Math.random() * 6) + 1;

const loadState = (): GameState => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return createInitialState();
    const parsed = JSON.parse(saved) as GameState;
    if (!parsed.players || !parsed.playerStats || !parsed.phase) return createInitialState();
    return parsed;
  } catch {
    return createInitialState();
  }
};

const saveState = (state: GameState) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

function DiceGamePage() {
  const [gameState, setGameState] = useState<GameState>(() => {
    if (typeof window === "undefined") return createInitialState();
    return loadState();
  });
  const [showRewardDialog, setShowRewardDialog] = useState(false);

  useEffect(() => {
    saveState(gameState);
  }, [gameState]);

  const activePlayers = gameState.players.filter((player) => !player.isEliminated);
  const sortedPlayers = useMemo(
    () => [...gameState.players].sort((a, b) => b.prizeMoney - a.prizeMoney || b.total - a.total),
    [gameState.players]
  );
  const totalRounds = gameState.history.length + (gameState.phase !== "input-reward" ? 1 : 0);

  const handleStartRound = useCallback((amount: number | null) => {
    setGameState((state) => ({
      ...state,
      players: state.players.map((player) =>
        player.isEliminated
          ? player
          : { ...player, dice1: 0, dice2: 0, total: 0, hasRolled: false }
      ),
      phase: "rolling",
      rewardAmount: amount,
      message: amount ? `本轮奖励 ¥${amount}，请依次投骰子` : "本轮奖励不详，请依次投骰子",
    }));
    setShowRewardDialog(false);
  }, []);

  const handlePlayerRoll = useCallback((playerId: string) => {
    setGameState((state) => {
      if (state.phase !== "rolling") return state;

      const players = state.players.map((player) => {
        if (player.id !== playerId || player.hasRolled || player.isEliminated) return player;
        const dice1 = rollDice();
        const dice2 = rollDice();
        return { ...player, dice1, dice2, total: dice1 + dice2, hasRolled: true };
      });

      const active = players.filter((player) => !player.isEliminated);
      if (!active.every((player) => player.hasRolled)) return { ...state, players };

      return calculateResult(players, state);
    });
  }, []);

  const handleNextRound = useCallback(() => {
    setGameState((state) => {
      if (state.winner) {
        return {
          ...state,
          players: INITIAL_PLAYERS.map((player) => ({ ...player })),
          winner: null,
          message: "请输入本次奖励金额",
          phase: "input-reward",
          rewardAmount: null,
        };
      }

      const active = state.players.filter((player) => !player.isEliminated);
      const maxScore = Math.max(...active.map((player) => player.total));
      const players = state.players.map((player) => {
        if (player.isEliminated) return player;
        if (player.total < maxScore) return { ...player, isEliminated: true };
        return { ...player, dice1: 0, dice2: 0, total: 0, hasRolled: false };
      });
      const remaining = players.filter((player) => !player.isEliminated);

      return {
        ...state,
        players,
        winner: null,
        message: remaining.length > 1 ? `剩余 ${remaining.length} 人继续比赛，请输入奖励金额` : "请输入奖励金额",
        phase: "input-reward",
        rewardAmount: null,
      };
    });
  }, []);

  const handleReset = useCallback(() => {
    setGameState(createInitialState());
  }, []);

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#020617] text-white">
      <div className="fixed inset-0 -z-20 bg-[#020617]" />
      <div className="fixed inset-0 -z-10 bg-[url('/assets/dice/neon-dice-bg.svg')] bg-cover bg-center" />
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_50%_12%,rgba(14,165,233,0.15),transparent_30%),linear-gradient(180deg,rgba(2,6,23,0.08),rgba(2,6,23,0.18)_42%,rgba(2,6,23,0.72))]" />

      <div className="mx-auto max-w-[1280px] px-4 py-5 sm:px-6 lg:px-8">
        <header className="relative mb-4 flex min-h-20 items-center justify-center">
          <a
            href="/"
            className="absolute left-0 top-1/2 -translate-y-1/2 rounded-lg border border-white/15 bg-black/35 p-2 text-slate-300 shadow-[0_0_20px_rgba(34,211,238,0.12)] backdrop-blur transition hover:border-cyan-200/50 hover:bg-cyan-400/10 hover:text-white"
            aria-label="返回应用入口"
          >
            <ArrowLeft className="h-5 w-5" />
          </a>
          <img
            src="/assets/dice/lucky-guy-logo.svg"
            alt="Lucky Guy"
            className="h-auto w-56 drop-shadow-[0_0_28px_rgba(34,211,238,0.55)] sm:w-72 md:w-80"
          />
        </header>

        <section className="mb-7 rounded-lg border border-cyan-200/20 bg-[#020a14]/88 px-5 py-3 shadow-[0_20px_80px_rgba(2,6,23,0.5),0_0_38px_rgba(34,211,238,0.08)] backdrop-blur-xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-5">
              <InlineMetric icon={Trophy} label="累计" value={totalRounds} suffix="轮" />
              <InlineMetric icon={Users} label="剩余" value={activePlayers.length} suffix="人" />
            </div>

            <div className="min-w-0 flex-1 text-center lg:px-8">
              <p className="truncate text-sm text-slate-300">
                {gameState.rewardAmount !== null ? (
                  <span className="font-semibold text-emerald-300">本轮奖励：¥{gameState.rewardAmount}</span>
                ) : (
                  <span>{gameState.message}</span>
                )}
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-2">
              {gameState.phase === "input-reward" && (
                <Button
                  onClick={() => setShowRewardDialog(true)}
                  className="rounded-full bg-gradient-to-r from-blue-500 to-violet-500 px-5 text-white shadow-[0_0_22px_rgba(99,102,241,0.35)] hover:from-blue-400 hover:to-fuchsia-400"
                >
                  <Play className="mr-2 h-4 w-4" />
                  开始本轮
                </Button>
              )}
              {gameState.phase === "result" && (
                <Button
                  onClick={handleNextRound}
                  className="rounded-full bg-gradient-to-r from-blue-500 to-violet-500 px-5 text-white shadow-[0_0_22px_rgba(99,102,241,0.35)] hover:from-blue-400 hover:to-fuchsia-400"
                >
                  <Play className="mr-2 h-4 w-4" />
                  {gameState.winner ? "新游戏" : "下一轮"}
                </Button>
              )}
              <Button
                onClick={handleReset}
                variant="outline"
                className="rounded-full border-white/20 bg-black/20 px-5 text-white hover:bg-white/10"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                重新开始
              </Button>
            </div>
          </div>
        </section>

        <AnimatePresence>
          {gameState.winner && (
            <motion.section
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              className="mb-6 rounded-lg border border-yellow-300/30 bg-[#050913]/90 p-5 text-center shadow-[0_0_70px_rgba(250,204,21,0.22)] backdrop-blur"
            >
              <Trophy className="mx-auto mb-3 h-12 w-12 text-yellow-300" />
              <h2 className="text-2xl font-semibold text-yellow-100">恭喜 {gameState.winner.name} 获得胜利</h2>
              <p className="mt-2 text-sm text-yellow-100/70">
                总分 {gameState.winner.total} 分，累计奖金 ¥{gameState.winner.prizeMoney}
              </p>
            </motion.section>
          )}
        </AnimatePresence>

        <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {sortedPlayers.map((player, index) => (
            <PlayerCard
              key={player.id}
              player={player}
              rank={index + 1}
              isWinner={gameState.winner?.id === player.id}
              canRoll={gameState.phase === "rolling" && !player.hasRolled && !player.isEliminated}
              onRoll={() => handlePlayerRoll(player.id)}
            />
          ))}
        </section>

        <section className="grid gap-6 py-7">
          <StatsPanel playerStats={gameState.playerStats} />
          <HistoryPanel history={gameState.history} />
        </section>

        <RulesPanel />
      </div>

      <AnimatePresence>
        {showRewardDialog && (
          <RewardDialog onCancel={() => setShowRewardDialog(false)} onConfirm={handleStartRound} />
        )}
      </AnimatePresence>
    </main>
  );
}

function calculateResult(players: Player[], state: GameState): GameState {
  const activePlayers = players.filter((player) => !player.isEliminated);
  const sortedPlayers = [...activePlayers].sort((a, b) => b.total - a.total);
  const maxScore = sortedPlayers[0].total;
  const topPlayers = sortedPlayers.filter((player) => player.total === maxScore);
  const eliminated = topPlayers.length === 1 ? [] : sortedPlayers.filter((player) => player.total < maxScore).map((player) => player.id);
  const winner = topPlayers.length === 1 ? topPlayers[0] : null;
  const rewardAmount = state.rewardAmount || 0;
  const winnerId = winner?.id || null;

  const finalPlayers = players.map((player) =>
    winnerId && player.id === winnerId
      ? { ...player, prizeMoney: player.prizeMoney + rewardAmount }
      : player
  );
  const winnerAfterPrize = finalPlayers.find((player) => player.id === winnerId) || null;

  const message = winnerAfterPrize
    ? `${winnerAfterPrize.name} 以 ${maxScore} 分获胜${rewardAmount ? `，获得 ¥${rewardAmount} 奖励` : ""}`
    : `${topPlayers.map((player) => player.name).join("、")} 并列 ${maxScore} 分，需要继续比赛`;

  const historyEntry: RoundRecord = {
    round: state.round,
    players: sortedPlayers.map((player, idx) => ({
      id: player.id,
      name: player.name,
      dice1: player.dice1,
      dice2: player.dice2,
      total: player.total,
      rank: idx + 1,
    })),
    eliminated,
    message,
    timestamp: Date.now(),
    rewardAmount,
    winnerId,
  };

  const playerStats = updateStats(state.playerStats, sortedPlayers, winnerAfterPrize, rewardAmount);

  return {
    ...state,
    players: finalPlayers,
    round: state.round + 1,
    winner: winnerAfterPrize,
    message,
    history: [...state.history, historyEntry],
    playerStats,
    phase: "result",
    rewardAmount: null,
  };
}

function updateStats(
  stats: Record<string, PlayerStats>,
  sortedPlayers: Player[],
  winner: Player | null,
  rewardAmount: number
) {
  const nextStats = { ...stats };
  sortedPlayers.forEach((player, idx) => {
    if (!nextStats[player.id]) {
      nextStats[player.id] = {
        playerId: player.id,
        playerName: player.name,
        firstPlace: 0,
        secondPlace: 0,
        thirdPlace: 0,
        fourthPlace: 0,
        totalGames: 0,
        totalPrizeMoney: 0,
      };
    }

    nextStats[player.id] = { ...nextStats[player.id], totalGames: nextStats[player.id].totalGames + 1 };
    const rank = idx + 1;
    if (winner?.id === player.id) {
      nextStats[player.id].firstPlace += 1;
      nextStats[player.id].totalPrizeMoney += rewardAmount;
    } else if (rank === 2) {
      nextStats[player.id].secondPlace += 1;
    } else if (rank === 3) {
      nextStats[player.id].thirdPlace += 1;
    } else if (rank === 4) {
      nextStats[player.id].fourthPlace += 1;
    }
  });
  return nextStats;
}

function PlayerCard({
  player,
  rank,
  isWinner,
  canRoll,
  onRoll,
}: {
  player: Player;
  rank: number;
  isWinner: boolean;
  canRoll: boolean;
  onRoll: () => void;
}) {
  const skin = PLAYER_SKIN[player.id];
  const inactive = player.isEliminated;

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={!inactive ? { y: -3 } : undefined}
      className={`relative min-h-[382px] overflow-hidden rounded-lg border bg-[#020a12]/95 p-5 backdrop-blur-xl transition ${
        inactive ? "border-white/10 opacity-45 grayscale" : `${skin.ring} shadow-[0_24px_90px_rgba(2,6,23,0.55)]`
      } ${isWinner ? "scale-[1.015] border-yellow-300/70 shadow-[0_0_70px_rgba(250,204,21,0.24)]" : ""}`}
    >
      <div className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-200/50 to-transparent`} />
      <div className={`absolute -inset-x-8 -top-16 h-32 bg-gradient-to-b ${skin.gradient} opacity-10 blur-3xl`} />
      <div className="mb-4 flex items-start justify-between">
        <span className={`rounded-md bg-gradient-to-r ${skin.gradient} px-3 py-1.5 text-xs font-black text-white shadow-[0_0_18px_rgba(168,85,247,0.35)]`}>
          #{rank}
        </span>
        {isWinner && <Trophy className="h-5 w-5 text-yellow-300" />}
      </div>

      <div className="flex flex-col items-center text-center">
        <div className={`relative mb-4 flex h-24 w-24 items-center justify-center rounded-full border-2 ${skin.ring} bg-black shadow-[0_0_38px_rgba(34,211,238,0.25)]`}>
          <div className={`absolute inset-1 rounded-full ${skin.avatarBg}`} />
          <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${skin.gradient} opacity-25 blur-md`} />
          <div className="absolute inset-[9px] rounded-full border border-white/35" />
          <span className="relative text-3xl font-black tracking-tight text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
            {skin.avatar}
          </span>
        </div>
        <h3 className="text-xl font-black text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.12)]">{player.name}</h3>
        <p className={`mt-2 text-base font-semibold ${skin.text}`}>{player.gender === "female" ? "♀" : "♂"}</p>
      </div>

      <div className="mt-7 flex min-h-20 items-center justify-center">
        {canRoll ? (
          <Button
            onClick={onRoll}
            className="rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 px-5 font-bold text-white shadow-[0_0_24px_rgba(34,211,238,0.35)] hover:from-cyan-400 hover:to-blue-400"
          >
            <Dice5 className="mr-2 h-4 w-4" />
            投骰子
          </Button>
        ) : player.hasRolled ? (
          <div className="flex items-center gap-4">
            <DiceFace value={player.dice1} />
            <span className="text-lg font-bold text-slate-500">+</span>
            <DiceFace value={player.dice2} />
          </div>
        ) : (
          <p className="text-sm text-slate-500">{inactive ? "已淘汰" : "等待开始"}</p>
        )}
      </div>

      <div className="mt-6 text-center">
        <p className="text-xs text-slate-500">总分</p>
        <p className="text-5xl font-black leading-none text-cyan-300 drop-shadow-[0_0_18px_rgba(34,211,238,0.6)]">{player.total}</p>
        {player.prizeMoney > 0 && <p className="mt-2 text-sm font-black text-emerald-300 drop-shadow-[0_0_12px_rgba(52,211,153,0.5)]">¥{player.prizeMoney}</p>}
      </div>

      <Sparkles className={`absolute bottom-5 left-5 h-4 w-4 ${skin.star} drop-shadow-[0_0_12px_currentColor]`} />

      {inactive && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/55 backdrop-blur-sm">
          <span className="rounded-lg border border-red-300/30 bg-red-500/15 px-4 py-2 font-semibold text-red-100">
            已淘汰
          </span>
        </div>
      )}
    </motion.article>
  );
}

function DiceFace({ value }: { value: number }) {
  const positions: Record<number, string[]> = {
    1: ["col-start-2 row-start-2"],
    2: ["col-start-1 row-start-1", "col-start-3 row-start-3"],
    3: ["col-start-1 row-start-1", "col-start-2 row-start-2", "col-start-3 row-start-3"],
    4: ["col-start-1 row-start-1", "col-start-3 row-start-1", "col-start-1 row-start-3", "col-start-3 row-start-3"],
    5: ["col-start-1 row-start-1", "col-start-3 row-start-1", "col-start-2 row-start-2", "col-start-1 row-start-3", "col-start-3 row-start-3"],
    6: ["col-start-1 row-start-1", "col-start-3 row-start-1", "col-start-1 row-start-2", "col-start-3 row-start-2", "col-start-1 row-start-3", "col-start-3 row-start-3"],
  };

  return (
    <div className="grid h-14 w-14 rotate-[-2deg] grid-cols-3 grid-rows-3 gap-1 rounded-md border border-violet-300/60 bg-gradient-to-br from-white to-slate-200 p-2 shadow-[0_0_18px_rgba(168,85,247,0.72),inset_0_0_12px_rgba(59,130,246,0.35)]">
      {positions[value].map((position) => (
        <span key={position} className={`${position} h-2.5 w-2.5 self-center justify-self-center rounded-full bg-slate-950 shadow-[0_0_7px_rgba(15,23,42,0.55)]`} />
      ))}
    </div>
  );
}

function RewardDialog({ onConfirm, onCancel }: { onConfirm: (amount: number | null) => void; onCancel: () => void }) {
  const [amount, setAmount] = useState("");

  const submit = (skipReward = false) => {
    if (skipReward) {
      onConfirm(null);
      return;
    }
    const value = Number(amount);
    if (Number.isFinite(value) && value > 0) onConfirm(value);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.94 }}
        className="w-full max-w-md rounded-lg border border-white/10 bg-[#0b1424] p-5 shadow-2xl"
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-2 text-cyan-100">
              <CircleDollarSign className="h-5 w-5" />
              输入本次奖励价值
            </div>
            <p className="text-sm text-slate-400">获胜者会累计获得本轮奖励。</p>
          </div>
          <button onClick={onCancel} className="rounded-md p-1 text-slate-500 hover:bg-white/10 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <Input
          autoFocus
          type="number"
          min="0"
          placeholder="例如：100"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") submit();
          }}
          className="border-white/10 bg-white/[0.06] text-white placeholder:text-slate-500"
        />

        <div className="mt-5 grid grid-cols-2 gap-3">
          <Button variant="outline" onClick={() => submit(true)} className="rounded-lg border-white/20 bg-white/[0.04] text-white hover:bg-white/10">
            不详
          </Button>
          <Button onClick={() => submit()} disabled={!amount || Number(amount) <= 0} className="rounded-lg bg-emerald-500 text-white hover:bg-emerald-400">
            开始比赛
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function StatsPanel({ playerStats }: { playerStats: Record<string, PlayerStats> }) {
  const [expanded, setExpanded] = useState(false);
  const stats = Object.values(playerStats).sort((a, b) => b.totalPrizeMoney - a.totalPrizeMoney);

  return (
    <Panel
      title="累计统计"
      icon={BarChart3}
      accent="text-cyan-200"
      expanded={expanded}
      onToggle={() => setExpanded((value) => !value)}
    >
      <div className="grid gap-3 sm:grid-cols-2">
        {stats.map((stat) => (
          <div key={stat.playerId} className="rounded-lg border border-white/10 bg-white/[0.04] p-3">
            <div className="mb-3 flex items-center justify-between">
              <h4 className="font-semibold text-white">{stat.playerName}</h4>
              <span className="text-sm font-semibold text-emerald-300">¥{stat.totalPrizeMoney}</span>
            </div>
            <div className="grid grid-cols-4 gap-2 text-center text-sm">
              <RankStat label="第1" value={stat.firstPlace} />
              <RankStat label="第2" value={stat.secondPlace} />
              <RankStat label="第3" value={stat.thirdPlace} />
              <RankStat label="第4" value={stat.fourthPlace} />
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function HistoryPanel({ history }: { history: RoundRecord[] }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Panel
      title={`比赛记录 ${history.length} 轮`}
      icon={History}
      accent="text-blue-200"
      expanded={expanded}
      onToggle={() => setExpanded((value) => !value)}
    >
      {history.length === 0 ? (
        <p className="text-sm text-slate-500">还没有比赛记录。</p>
      ) : (
        <div className="max-h-80 space-y-3 overflow-y-auto pr-1">
          {[...history].reverse().map((record) => (
            <div key={`${record.round}-${record.timestamp}`} className="rounded-lg border border-white/10 bg-white/[0.04] p-3">
              <div className="mb-2 flex items-center justify-between gap-3">
                <h4 className="font-semibold text-white">第 {record.round} 轮</h4>
                <span className="text-xs text-slate-500">{record.rewardAmount ? `奖励 ¥${record.rewardAmount}` : "奖励不详"}</span>
              </div>
              <p className="mb-2 text-xs text-slate-400">{record.message}</p>
              <div className="space-y-1">
                {record.players.map((player) => (
                  <div key={player.id} className="flex items-center justify-between rounded-md px-2 py-1 text-sm text-slate-300 hover:bg-white/[0.04]">
                    <span>#{player.rank} {player.name}</span>
                    <span className="text-cyan-200">{player.dice1} + {player.dice2} = {player.total}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </Panel>
  );
}

function RulesPanel() {
  return (
    <section className="mb-8 overflow-hidden rounded-lg border border-cyan-200/15 bg-[#020a12]/92 backdrop-blur-xl">
      <div className="mb-3 flex items-center gap-2 text-purple-100">
        <div className="flex w-full items-center gap-2 border-b border-white/10 px-5 py-4">
          <FileText className="h-5 w-5 text-purple-300" />
          <h2 className="font-semibold">游戏规则</h2>
        </div>
      </div>
      <div className="grid gap-2 px-5 pb-5 text-sm text-slate-400 sm:grid-cols-2 lg:grid-cols-5">
        <p>输入本轮奖励金额。</p>
        <p>每位玩家依次投两颗骰子。</p>
        <p>最后一人投完后自动公布结果。</p>
        <p>分数最高者获胜并获得奖励。</p>
        <p>若最高分并列，则并列玩家继续比赛。</p>
      </div>
    </section>
  );
}

function Panel({
  title,
  icon: Icon,
  accent,
  expanded,
  onToggle,
  children,
}: {
  title: string;
  icon: typeof BarChart3;
  accent: string;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-lg border border-cyan-200/15 bg-[#020a12]/92 shadow-[0_18px_70px_rgba(2,6,23,0.42)] backdrop-blur-xl">
      <button onClick={onToggle} className="flex w-full items-center justify-between px-5 py-4 text-left transition hover:bg-white/[0.035]">
        <span className="flex items-center gap-2 font-semibold text-white">
          <Icon className={`h-5 w-5 ${accent}`} />
          {title}
        </span>
        {expanded ? <ChevronUp className="h-5 w-5 text-slate-500" /> : <ChevronDown className="h-5 w-5 text-slate-500" />}
      </button>
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="border-t border-white/10 p-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function InlineMetric({
  icon: Icon,
  label,
  value,
  suffix,
}: {
  icon: typeof Trophy;
  label: string;
  value: number;
  suffix: string;
}) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <Icon className="h-5 w-5 text-cyan-300 drop-shadow-[0_0_10px_rgba(34,211,238,0.7)]" />
      <span className="text-slate-400">{label}</span>
      <span className="text-2xl font-black text-cyan-300 drop-shadow-[0_0_12px_rgba(34,211,238,0.55)]">{value}</span>
      <span className="text-slate-400">{suffix}</span>
    </div>
  );
}

function RankStat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <p className="font-semibold text-white">{value}</p>
      <p className="text-xs text-slate-500">{label}</p>
    </div>
  );
}
