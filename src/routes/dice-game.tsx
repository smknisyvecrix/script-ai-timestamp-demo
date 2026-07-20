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

const PLAYER_SKIN: Record<string, { gradient: string; ring: string; text: string; avatar: string }> = {
  "1": { gradient: "from-orange-500 to-amber-300", ring: "border-orange-400/60", text: "text-orange-200", avatar: "龙" },
  "2": { gradient: "from-pink-500 to-fuchsia-400", ring: "border-pink-400/60", text: "text-pink-200", avatar: "婵" },
  "3": { gradient: "from-blue-500 to-cyan-300", ring: "border-cyan-300/60", text: "text-cyan-200", avatar: "鹏" },
  "4": { gradient: "from-yellow-400 to-lime-300", ring: "border-yellow-300/60", text: "text-yellow-100", avatar: "伟" },
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
    <main className="min-h-screen bg-[#060b16] text-white">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_18%_0%,rgba(14,165,233,0.22),transparent_28%),radial-gradient(circle_at_90%_12%,rgba(245,158,11,0.16),transparent_30%),linear-gradient(135deg,#060b16,#0c1426_52%,#07111d)]" />
      <div className="fixed inset-0 -z-10 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:36px_36px]" />

      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <header className="mb-5 flex flex-col gap-4 rounded-lg border border-white/10 bg-white/[0.05] p-4 backdrop-blur md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <a href="/" className="rounded-lg border border-white/10 bg-white/[0.06] p-2 text-slate-300 transition hover:bg-white/10 hover:text-white">
              <ArrowLeft className="h-5 w-5" />
            </a>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 shadow-[0_0_30px_rgba(34,211,238,0.35)]">
              <Dice5 className="h-7 w-7" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-cyan-200/80">Lucky Guy</p>
              <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">内部骰子游戏</h1>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm sm:flex sm:items-center">
            <Metric icon={Trophy} label="累计轮次" value={`${totalRounds}`} />
            <Metric icon={Users} label="剩余玩家" value={`${activePlayers.length}`} />
          </div>
        </header>

        <section className="mb-5 rounded-lg border border-cyan-200/15 bg-white/[0.06] p-4 shadow-[0_24px_90px_rgba(8,47,73,0.2)] backdrop-blur">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2 text-sm text-cyan-100">
                <Sparkles className="h-4 w-4 text-cyan-300" />
                {gameState.rewardAmount !== null ? `本轮奖励：¥${gameState.rewardAmount}` : "赛前准备"}
              </div>
              <p className="text-lg font-medium text-white">{gameState.message}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {gameState.phase === "input-reward" && (
                <Button onClick={() => setShowRewardDialog(true)} className="rounded-lg bg-cyan-500 text-white hover:bg-cyan-400">
                  <Play className="mr-2 h-4 w-4" />
                  开始本轮
                </Button>
              )}
              {gameState.phase === "result" && (
                <Button onClick={handleNextRound} className="rounded-lg bg-blue-600 text-white hover:bg-blue-500">
                  <Play className="mr-2 h-4 w-4" />
                  {gameState.winner ? "新游戏" : "下一轮"}
                </Button>
              )}
              <Button onClick={handleReset} variant="outline" className="rounded-lg border-white/20 bg-white/[0.04] text-white hover:bg-white/10">
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
              className="mb-5 rounded-lg border border-yellow-300/30 bg-yellow-300/10 p-5 text-center shadow-[0_0_60px_rgba(250,204,21,0.14)]"
            >
              <Trophy className="mx-auto mb-3 h-12 w-12 text-yellow-300" />
              <h2 className="text-2xl font-semibold text-yellow-100">恭喜 {gameState.winner.name} 获得胜利</h2>
              <p className="mt-2 text-sm text-yellow-100/70">
                总分 {gameState.winner.total} 分，累计奖金 ¥{gameState.winner.prizeMoney}
              </p>
            </motion.section>
          )}
        </AnimatePresence>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
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

        <section className="grid gap-5 py-5 lg:grid-cols-[0.9fr_1.1fr]">
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
      className={`relative overflow-hidden rounded-lg border bg-white/[0.055] p-5 backdrop-blur transition ${
        inactive ? "border-white/10 opacity-45 grayscale" : `${skin.ring} shadow-[0_20px_80px_rgba(8,47,73,0.18)]`
      } ${isWinner ? "scale-[1.02] border-yellow-300/70 shadow-[0_0_50px_rgba(250,204,21,0.18)]" : ""}`}
    >
      <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${skin.gradient}`} />
      <div className="mb-4 flex items-start justify-between">
        <span className={`rounded-md bg-gradient-to-r ${skin.gradient} px-2.5 py-1 text-xs font-bold text-white`}>
          #{rank}
        </span>
        {isWinner && <Trophy className="h-5 w-5 text-yellow-300" />}
      </div>

      <div className="flex flex-col items-center text-center">
        <div className={`mb-3 flex h-24 w-24 items-center justify-center rounded-full border-2 ${skin.ring} bg-gradient-to-br ${skin.gradient} text-4xl font-black text-white shadow-[0_0_28px_rgba(34,211,238,0.25)]`}>
          {skin.avatar}
        </div>
        <h3 className="text-lg font-semibold text-white">{player.name}</h3>
        <p className={`mt-1 text-xs ${skin.text}`}>{player.gender === "female" ? "Female Player" : "Male Player"}</p>
      </div>

      <div className="mt-5 flex min-h-20 items-center justify-center">
        {canRoll ? (
          <Button onClick={onRoll} className="rounded-lg bg-cyan-500 text-white hover:bg-cyan-400">
            <Dice5 className="mr-2 h-4 w-4" />
            投骰子
          </Button>
        ) : player.hasRolled ? (
          <div className="flex items-center gap-3">
            <DiceFace value={player.dice1} />
            <span className="text-slate-400">+</span>
            <DiceFace value={player.dice2} />
          </div>
        ) : (
          <p className="text-sm text-slate-500">{inactive ? "已淘汰" : "等待开始"}</p>
        )}
      </div>

      <div className="mt-4 rounded-lg border border-white/10 bg-black/20 p-3 text-center">
        <p className="text-xs text-slate-500">总分</p>
        <p className="mt-1 text-3xl font-semibold text-cyan-100">{player.total}</p>
        {player.prizeMoney > 0 && <p className="mt-2 text-xs font-semibold text-emerald-300">累计奖金 ¥{player.prizeMoney}</p>}
      </div>

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
    <div className="grid h-14 w-14 grid-cols-3 grid-rows-3 gap-1 rounded-lg border border-cyan-200/25 bg-slate-950 p-2 shadow-[0_0_22px_rgba(34,211,238,0.16)]">
      {positions[value].map((position) => (
        <span key={position} className={`${position} h-2.5 w-2.5 self-center justify-self-center rounded-full bg-cyan-200 shadow-[0_0_10px_rgba(165,243,252,0.8)]`} />
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
  const [expanded, setExpanded] = useState(true);
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
  const [expanded, setExpanded] = useState(true);

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
    <section className="mb-8 rounded-lg border border-white/10 bg-white/[0.04] p-5 backdrop-blur">
      <div className="mb-3 flex items-center gap-2 text-purple-100">
        <FileText className="h-5 w-5" />
        <h2 className="font-semibold">游戏规则</h2>
      </div>
      <div className="grid gap-2 text-sm text-slate-400 sm:grid-cols-2 lg:grid-cols-5">
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
    <section className="overflow-hidden rounded-lg border border-white/10 bg-white/[0.045] backdrop-blur">
      <button onClick={onToggle} className="flex w-full items-center justify-between border-b border-white/10 px-4 py-3 text-left">
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
            <div className="p-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function Metric({ icon: Icon, label, value }: { icon: typeof Trophy; label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.055] px-3 py-2">
      <div className="flex items-center gap-2 text-slate-400">
        <Icon className="h-4 w-4 text-cyan-200" />
        <span className="text-xs">{label}</span>
      </div>
      <p className="mt-1 text-lg font-semibold text-white">{value}</p>
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
