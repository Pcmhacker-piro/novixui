import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  // Navigation & Direction
  Home, Compass, MapPin, Navigation, Navigation2, Menu, X, ArrowLeft, ArrowRight,
  ArrowUp, ArrowDown, ArrowUpRight, ArrowDownLeft, ArrowDownRight, ArrowUpLeft,
  ArrowLeftRight, ArrowUpDown, ChevronLeft, ChevronRight, ChevronUp, ChevronDown,
  ChevronsLeft, ChevronsRight, ChevronsUp, ChevronsDown, ChevronsUpDown,
  CornerDownLeft, CornerDownRight, CornerUpLeft, CornerUpRight, Move, ExternalLink,
  Link as LinkIcon, Link2, Unlink,

  // Interface & Actions
  Search, Settings, Sliders, SlidersHorizontal, Filter, Plus, Minus, Check,
  CheckCheck, Copy, Trash2, Trash, Edit, Edit2, Edit3, PenTool, Scissors,
  Paperclip, Save, Download, Upload, Share2, RefreshCw, RefreshCcw, RotateCw,
  RotateCcw, Maximize2, Minimize2, ZoomIn, ZoomOut, MoreHorizontal, MoreVertical,
  Power, LogOut, LogIn, History, Sparkles, Zap, Flame,

  // Communication & Users
  Mail, Inbox, Send, MessageSquare, MessageCircle, MessagesSquare, Phone,
  PhoneCall, PhoneOff, PhoneIncoming, PhoneOutgoing, AtSign, Hash, Globe,
  Rss, Bell, BellRing, BellOff, Users, User, UserPlus, UserMinus, UserCheck,
  UserX, Heart, ThumbsUp, ThumbsDown,

  // Media & Audio
  Play, Pause, Square, Circle, SkipForward, SkipBack, FastForward, Rewind,
  Volume, Volume1, Volume2, VolumeX, Mic, MicOff, Headphones, Radio, Music,
  Film, Video, VideoOff, Camera, CameraOff, Image, Images,

  // Tech & Hardware
  Monitor, Smartphone, Tablet, Laptop, Tv, Watch, Cpu, HardDrive, Database,
  Server, Wifi, WifiOff, Bluetooth, Cast, Terminal, Code2, GitBranch, GitCommit,
  GitPullRequest, GitMerge, Cloud, CloudRain, CloudSnow, Sun, Moon,

  // Security & Alerts
  Lock, Unlock, Key, Shield, ShieldCheck, ShieldAlert, ShieldX, Fingerprint,
  Eye, EyeOff, AlertCircle, AlertTriangle, AlertOctagon, CheckCircle2,
  CheckCircle, XCircle, XOctagon, Info, HelpCircle, Activity, BatteryCharging,
  BatteryMedium, BatteryLow, BatteryWarning,

  // Commerce & Productivity
  CreditCard, Wallet, DollarSign, Coins, Receipt, ShoppingBag, ShoppingCart,
  Tag, Package, Box, Archive, Folder, FolderPlus, FolderOpen, File, FileText,
  FileCode2, FilePlus, FileCheck, Calendar, CalendarDays, Clock, Timer,
  Bookmark, Star, Award, Trophy, Target, TrendingUp, TrendingDown, BarChart3,
  PieChart, LineChart, Table,

  // Layout & Design
  LayoutGrid, Grid, List, Columns, Rows, PanelLeft, PanelRight, Split,
  Palette, Pipette, Type, Feather, Contrast, Shapes, Wand2, Layers,

  type LucideIcon,
} from "lucide-react";
import { DocsShell, DocSection, DocLead, DocParagraph } from "@/components/docs/docs-shell";
import { CodeBlock } from "@/components/docs/code-block";
import { Callout } from "@/components/docs/callout";
import { Icon, type IconSize } from "@/nova/icons";
import { Input } from "@/nova/ui/input";

export const Route = createFileRoute("/docs/tokens/icons")({
  component: IconsPage,
  head: () => ({
    meta: [
      { title: "Icons · Novix UI" },
      { name: "description", content: "The Nova icon system: lucide-react wrapped for accessibility, sizing, and design-token colors." },
      { property: "og:title", content: "Icons · Novix UI" },
      { property: "og:description", content: "The Nova icon system: lucide-react wrapped for accessibility, sizing, and design-token colors." },
      { property: "og:url", content: "/docs/tokens/icons" },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Icons · Novix UI" },
      { name: "twitter:description", content: "The Nova icon system: lucide-react wrapped for accessibility, sizing, and design-token colors." },
    ],
    links: [{ rel: "canonical", href: "/docs/tokens/icons" }],
  }),
});

const SIZES = [
  { name: "xs", px: 12, use: "Inline chips, dense tables" },
  { name: "sm", px: 14, use: "Buttons, inputs, badges" },
  { name: "md", px: 16, use: "Default UI icons" },
  { name: "lg", px: 20, use: "Prominent controls, toolbars" },
  { name: "xl", px: 24, use: "Empty states, hero glyphs" },
] as const;

type IconCategory =
  | "All"
  | "Navigation"
  | "Actions"
  | "Communication"
  | "Media"
  | "Tech & Code"
  | "Security & Status"
  | "Commerce & Data"
  | "Layout & Design";

interface GalleryEntry {
  name: string;
  icon: LucideIcon;
  category: Exclude<IconCategory, "All">;
  keywords?: string[];
}

const GALLERY: GalleryEntry[] = [
  // Navigation & Direction
  { name: "Home", icon: Home, category: "Navigation", keywords: ["house", "main", "start"] },
  { name: "Compass", icon: Compass, category: "Navigation", keywords: ["direction", "safari", "explore"] },
  { name: "MapPin", icon: MapPin, category: "Navigation", keywords: ["location", "place", "geo"] },
  { name: "Navigation", icon: Navigation, category: "Navigation", keywords: ["gps", "arrow", "travel"] },
  { name: "Navigation2", icon: Navigation2, category: "Navigation", keywords: ["gps", "pointer"] },
  { name: "Menu", icon: Menu, category: "Navigation", keywords: ["hamburger", "drawer", "sidebar"] },
  { name: "X", icon: X, category: "Navigation", keywords: ["close", "exit", "cancel", "dismiss"] },
  { name: "ArrowLeft", icon: ArrowLeft, category: "Navigation", keywords: ["back", "previous", "west"] },
  { name: "ArrowRight", icon: ArrowRight, category: "Navigation", keywords: ["forward", "next", "east"] },
  { name: "ArrowUp", icon: ArrowUp, category: "Navigation", keywords: ["up", "north", "top"] },
  { name: "ArrowDown", icon: ArrowDown, category: "Navigation", keywords: ["down", "south", "bottom"] },
  { name: "ArrowUpRight", icon: ArrowUpRight, category: "Navigation", keywords: ["external", "diagonal"] },
  { name: "ArrowDownLeft", icon: ArrowDownLeft, category: "Navigation", keywords: ["diagonal", "incoming"] },
  { name: "ArrowDownRight", icon: ArrowDownRight, category: "Navigation", keywords: ["diagonal", "outgoing"] },
  { name: "ArrowUpLeft", icon: ArrowUpLeft, category: "Navigation", keywords: ["diagonal", "top-left"] },
  { name: "ArrowLeftRight", icon: ArrowLeftRight, category: "Navigation", keywords: ["swap", "transfer", "horizontal"] },
  { name: "ArrowUpDown", icon: ArrowUpDown, category: "Navigation", keywords: ["sort", "reorder", "vertical"] },
  { name: "ChevronLeft", icon: ChevronLeft, category: "Navigation", keywords: ["back", "caret", "left"] },
  { name: "ChevronRight", icon: ChevronRight, category: "Navigation", keywords: ["forward", "caret", "right"] },
  { name: "ChevronUp", icon: ChevronUp, category: "Navigation", keywords: ["collapse", "caret", "up"] },
  { name: "ChevronDown", icon: ChevronDown, category: "Navigation", keywords: ["expand", "caret", "dropdown"] },
  { name: "ChevronsLeft", icon: ChevronsLeft, category: "Navigation", keywords: ["first", "rewind", "double"] },
  { name: "ChevronsRight", icon: ChevronsRight, category: "Navigation", keywords: ["last", "fast-forward", "double"] },
  { name: "ChevronsUp", icon: ChevronsUp, category: "Navigation", keywords: ["top", "scroll", "double"] },
  { name: "ChevronsDown", icon: ChevronsDown, category: "Navigation", keywords: ["bottom", "scroll", "double"] },
  { name: "ChevronsUpDown", icon: ChevronsUpDown, category: "Navigation", keywords: ["select", "combobox", "sort"] },
  { name: "CornerDownLeft", icon: CornerDownLeft, category: "Navigation", keywords: ["enter", "return", "keyboard"] },
  { name: "CornerDownRight", icon: CornerDownRight, category: "Navigation", keywords: ["sub-item", "tree"] },
  { name: "CornerUpLeft", icon: CornerUpLeft, category: "Navigation", keywords: ["reply", "undo"] },
  { name: "CornerUpRight", icon: CornerUpRight, category: "Navigation", keywords: ["redo", "forward"] },
  { name: "Move", icon: Move, category: "Navigation", keywords: ["drag", "position", "pan"] },
  { name: "ExternalLink", icon: ExternalLink, category: "Navigation", keywords: ["new tab", "open", "href"] },
  { name: "Link", icon: LinkIcon, category: "Navigation", keywords: ["url", "hyperlink", "anchor"] },
  { name: "Link2", icon: Link2, category: "Navigation", keywords: ["chain", "connect"] },
  { name: "Unlink", icon: Unlink, category: "Navigation", keywords: ["disconnect", "broken"] },

  // Interface & Actions
  { name: "Search", icon: Search, category: "Actions", keywords: ["find", "lookup", "query", "filter"] },
  { name: "Settings", icon: Settings, category: "Actions", keywords: ["preferences", "gear", "cog", "options"] },
  { name: "Sliders", icon: Sliders, category: "Actions", keywords: ["controls", "adjust", "tuning"] },
  { name: "SlidersHorizontal", icon: SlidersHorizontal, category: "Actions", keywords: ["filters", "parameters"] },
  { name: "Filter", icon: Filter, category: "Actions", keywords: ["funnel", "refine", "sort"] },
  { name: "Plus", icon: Plus, category: "Actions", keywords: ["add", "new", "create", "increment"] },
  { name: "Minus", icon: Minus, category: "Actions", keywords: ["remove", "subtract", "decrement"] },
  { name: "Check", icon: Check, category: "Actions", keywords: ["confirm", "done", "ok", "tick"] },
  { name: "CheckCheck", icon: CheckCheck, category: "Actions", keywords: ["read", "delivered", "double check"] },
  { name: "Copy", icon: Copy, category: "Actions", keywords: ["duplicate", "clipboard", "clone"] },
  { name: "Trash2", icon: Trash2, category: "Actions", keywords: ["delete", "remove", "bin", "garbage"] },
  { name: "Trash", icon: Trash, category: "Actions", keywords: ["delete", "wastebasket"] },
  { name: "Edit", icon: Edit, category: "Actions", keywords: ["pencil", "modify", "write"] },
  { name: "Edit2", icon: Edit2, category: "Actions", keywords: ["pen", "draft"] },
  { name: "Edit3", icon: Edit3, category: "Actions", keywords: ["compose", "rename"] },
  { name: "PenTool", icon: PenTool, category: "Actions", keywords: ["bezier", "draw", "vector"] },
  { name: "Scissors", icon: Scissors, category: "Actions", keywords: ["cut", "trim"] },
  { name: "Paperclip", icon: Paperclip, category: "Actions", keywords: ["attachment", "file", "join"] },
  { name: "Save", icon: Save, category: "Actions", keywords: ["floppy", "disk", "store"] },
  { name: "Download", icon: Download, category: "Actions", keywords: ["export", "save", "fetch"] },
  { name: "Upload", icon: Upload, category: "Actions", keywords: ["import", "publish", "push"] },
  { name: "Share2", icon: Share2, category: "Actions", keywords: ["send", "social", "nodes"] },
  { name: "RefreshCw", icon: RefreshCw, category: "Actions", keywords: ["reload", "sync", "spin"] },
  { name: "RefreshCcw", icon: RefreshCcw, category: "Actions", keywords: ["counter-clockwise", "restart"] },
  { name: "RotateCw", icon: RotateCw, category: "Actions", keywords: ["turn", "clockwise"] },
  { name: "RotateCcw", icon: RotateCcw, category: "Actions", keywords: ["undo", "turn"] },
  { name: "Maximize2", icon: Maximize2, category: "Actions", keywords: ["fullscreen", "expand"] },
  { name: "Minimize2", icon: Minimize2, category: "Actions", keywords: ["exit fullscreen", "shrink"] },
  { name: "ZoomIn", icon: ZoomIn, category: "Actions", keywords: ["magnify", "scale up"] },
  { name: "ZoomOut", icon: ZoomOut, category: "Actions", keywords: ["scale down"] },
  { name: "MoreHorizontal", icon: MoreHorizontal, category: "Actions", keywords: ["kebab", "dots", "menu"] },
  { name: "MoreVertical", icon: MoreVertical, category: "Actions", keywords: ["meatballs", "dots"] },
  { name: "Power", icon: Power, category: "Actions", keywords: ["on", "off", "shutdown", "switch"] },
  { name: "LogOut", icon: LogOut, category: "Actions", keywords: ["sign out", "leave", "exit"] },
  { name: "LogIn", icon: LogIn, category: "Actions", keywords: ["sign in", "enter", "access"] },
  { name: "History", icon: History, category: "Actions", keywords: ["time", "recent", "log", "revert"] },
  { name: "Sparkles", icon: Sparkles, category: "Actions", keywords: ["ai", "magic", "stars", "generate"] },
  { name: "Zap", icon: Zap, category: "Actions", keywords: ["fast", "energy", "lightning", "power"] },
  { name: "Flame", icon: Flame, category: "Actions", keywords: ["hot", "fire", "popular", "trending"] },

  // Communication & Users
  { name: "Mail", icon: Mail, category: "Communication", keywords: ["email", "letter", "envelope"] },
  { name: "Inbox", icon: Inbox, category: "Communication", keywords: ["messages", "tray", "archive"] },
  { name: "Send", icon: Send, category: "Communication", keywords: ["paper plane", "submit", "post"] },
  { name: "MessageSquare", icon: MessageSquare, category: "Communication", keywords: ["chat", "comment", "bubble"] },
  { name: "MessageCircle", icon: MessageCircle, category: "Communication", keywords: ["conversation", "dialogue"] },
  { name: "MessagesSquare", icon: MessagesSquare, category: "Communication", keywords: ["threads", "discussions"] },
  { name: "Phone", icon: Phone, category: "Communication", keywords: ["call", "telephone", "ring"] },
  { name: "PhoneCall", icon: PhoneCall, category: "Communication", keywords: ["dial", "active call"] },
  { name: "PhoneOff", icon: PhoneOff, category: "Communication", keywords: ["hang up", "mute"] },
  { name: "PhoneIncoming", icon: PhoneIncoming, category: "Communication", keywords: ["received call"] },
  { name: "PhoneOutgoing", icon: PhoneOutgoing, category: "Communication", keywords: ["dialed call"] },
  { name: "AtSign", icon: AtSign, category: "Communication", keywords: ["mention", "email", "handle"] },
  { name: "Hash", icon: Hash, category: "Communication", keywords: ["tag", "channel", "number", "slack"] },
  { name: "Globe", icon: Globe, category: "Communication", keywords: ["world", "internet", "web", "i18n"] },
  { name: "Rss", icon: Rss, category: "Communication", keywords: ["feed", "syndication", "broadcast"] },
  { name: "Bell", icon: Bell, category: "Communication", keywords: ["notification", "alert", "alarm"] },
  { name: "BellRing", icon: BellRing, category: "Communication", keywords: ["active notification", "ringing"] },
  { name: "BellOff", icon: BellOff, category: "Communication", keywords: ["silent", "mute notifications"] },
  { name: "Users", icon: Users, category: "Communication", keywords: ["team", "group", "members"] },
  { name: "User", icon: User, category: "Communication", keywords: ["account", "profile", "person"] },
  { name: "UserPlus", icon: UserPlus, category: "Communication", keywords: ["invite", "add member", "signup"] },
  { name: "UserMinus", icon: UserMinus, category: "Communication", keywords: ["kick", "remove member"] },
  { name: "UserCheck", icon: UserCheck, category: "Communication", keywords: ["verified user", "approved"] },
  { name: "UserX", icon: UserX, category: "Communication", keywords: ["blocked", "banned"] },
  { name: "Heart", icon: Heart, category: "Communication", keywords: ["like", "favorite", "love"] },
  { name: "ThumbsUp", icon: ThumbsUp, category: "Communication", keywords: ["agree", "upvote", "like"] },
  { name: "ThumbsDown", icon: ThumbsDown, category: "Communication", keywords: ["disagree", "downvote"] },

  // Media & Audio
  { name: "Play", icon: Play, category: "Media", keywords: ["start", "video", "audio"] },
  { name: "Pause", icon: Pause, category: "Media", keywords: ["stop", "freeze", "hold"] },
  { name: "Square", icon: Square, category: "Media", keywords: ["stop", "shape"] },
  { name: "Circle", icon: Circle, category: "Media", keywords: ["record", "dot"] },
  { name: "SkipForward", icon: SkipForward, category: "Media", keywords: ["next track"] },
  { name: "SkipBack", icon: SkipBack, category: "Media", keywords: ["previous track"] },
  { name: "FastForward", icon: FastForward, category: "Media", keywords: ["speed up", "seek"] },
  { name: "Rewind", icon: Rewind, category: "Media", keywords: ["backtrack", "seek"] },
  { name: "Volume", icon: Volume, category: "Media", keywords: ["speaker", "sound"] },
  { name: "Volume1", icon: Volume1, category: "Media", keywords: ["low volume"] },
  { name: "Volume2", icon: Volume2, category: "Media", keywords: ["high volume", "loud"] },
  { name: "VolumeX", icon: VolumeX, category: "Media", keywords: ["mute", "silent"] },
  { name: "Mic", icon: Mic, category: "Media", keywords: ["microphone", "record", "voice"] },
  { name: "MicOff", icon: MicOff, category: "Media", keywords: ["muted mic"] },
  { name: "Headphones", icon: Headphones, category: "Media", keywords: ["audio", "listen", "music"] },
  { name: "Radio", icon: Radio, category: "Media", keywords: ["broadcast", "tuner", "frequency"] },
  { name: "Music", icon: Music, category: "Media", keywords: ["note", "song", "audio"] },
  { name: "Film", icon: Film, category: "Media", keywords: ["movie", "cinema", "reel"] },
  { name: "Video", icon: Video, category: "Media", keywords: ["camcorder", "record", "stream"] },
  { name: "VideoOff", icon: VideoOff, category: "Media", keywords: ["camera off"] },
  { name: "Camera", icon: Camera, category: "Media", keywords: ["photo", "snapshot"] },
  { name: "CameraOff", icon: CameraOff, category: "Media", keywords: ["no photo"] },
  { name: "Image", icon: Image, category: "Media", keywords: ["photo", "picture", "asset"] },
  { name: "Images", icon: Images, category: "Media", keywords: ["gallery", "photos"] },

  // Tech & Code
  { name: "Monitor", icon: Monitor, category: "Tech & Code", keywords: ["desktop", "screen", "display"] },
  { name: "Smartphone", icon: Smartphone, category: "Tech & Code", keywords: ["mobile", "phone", "iphone", "android"] },
  { name: "Tablet", icon: Tablet, category: "Tech & Code", keywords: ["ipad", "device"] },
  { name: "Laptop", icon: Laptop, category: "Tech & Code", keywords: ["notebook", "macbook", "computer"] },
  { name: "Tv", icon: Tv, category: "Tech & Code", keywords: ["television", "cast"] },
  { name: "Watch", icon: Watch, category: "Tech & Code", keywords: ["time", "wearable", "clock"] },
  { name: "Cpu", icon: Cpu, category: "Tech & Code", keywords: ["processor", "chip", "compute"] },
  { name: "HardDrive", icon: HardDrive, category: "Tech & Code", keywords: ["disk", "storage", "ssd"] },
  { name: "Database", icon: Database, category: "Tech & Code", keywords: ["sql", "postgres", "records"] },
  { name: "Server", icon: Server, category: "Tech & Code", keywords: ["backend", "cluster", "hosting"] },
  { name: "Wifi", icon: Wifi, category: "Tech & Code", keywords: ["network", "internet", "wireless"] },
  { name: "WifiOff", icon: WifiOff, category: "Tech & Code", keywords: ["offline", "no connection"] },
  { name: "Bluetooth", icon: Bluetooth, category: "Tech & Code", keywords: ["pairing", "wireless"] },
  { name: "Cast", icon: Cast, category: "Tech & Code", keywords: ["airplay", "chromecast", "stream"] },
  { name: "Terminal", icon: Terminal, category: "Tech & Code", keywords: ["cli", "console", "bash", "shell"] },
  { name: "Code2", icon: Code2, category: "Tech & Code", keywords: ["brackets", "programming", "developer"] },
  { name: "GitBranch", icon: GitBranch, category: "Tech & Code", keywords: ["vcs", "branch", "fork"] },
  { name: "GitCommit", icon: GitCommit, category: "Tech & Code", keywords: ["vcs", "hash", "save"] },
  { name: "GitPullRequest", icon: GitPullRequest, category: "Tech & Code", keywords: ["github", "pr", "merge"] },
  { name: "GitMerge", icon: GitMerge, category: "Tech & Code", keywords: ["git", "combine"] },
  { name: "Cloud", icon: Cloud, category: "Tech & Code", keywords: ["storage", "weather", "aws"] },
  { name: "CloudRain", icon: CloudRain, category: "Tech & Code", keywords: ["weather", "precipitation"] },
  { name: "CloudSnow", icon: CloudSnow, category: "Tech & Code", keywords: ["winter", "freeze"] },
  { name: "Sun", icon: Sun, category: "Tech & Code", keywords: ["light mode", "day", "brightness"] },
  { name: "Moon", icon: Moon, category: "Tech & Code", keywords: ["dark mode", "night", "theme"] },

  // Security & Status
  { name: "Lock", icon: Lock, category: "Security & Status", keywords: ["secure", "password", "private", "closed"] },
  { name: "Unlock", icon: Unlock, category: "Security & Status", keywords: ["open", "public", "accessible"] },
  { name: "Key", icon: Key, category: "Security & Status", keywords: ["api key", "auth", "token", "access"] },
  { name: "Shield", icon: Shield, category: "Security & Status", keywords: ["protect", "defense", "armor"] },
  { name: "ShieldCheck", icon: ShieldCheck, category: "Security & Status", keywords: ["verified", "secure", "safe"] },
  { name: "ShieldAlert", icon: ShieldAlert, category: "Security & Status", keywords: ["vulnerability", "warning"] },
  { name: "ShieldX", icon: ShieldX, category: "Security & Status", keywords: ["threat", "blocked"] },
  { name: "Fingerprint", icon: Fingerprint, category: "Security & Status", keywords: ["biometric", "touch id", "identity"] },
  { name: "Eye", icon: Eye, category: "Security & Status", keywords: ["show", "visible", "inspect"] },
  { name: "EyeOff", icon: EyeOff, category: "Security & Status", keywords: ["hide", "conceal", "private"] },
  { name: "AlertCircle", icon: AlertCircle, category: "Security & Status", keywords: ["error", "warning", "important"] },
  { name: "AlertTriangle", icon: AlertTriangle, category: "Security & Status", keywords: ["caution", "danger", "hazard"] },
  { name: "AlertOctagon", icon: AlertOctagon, category: "Security & Status", keywords: ["stop", "critical"] },
  { name: "CheckCircle2", icon: CheckCircle2, category: "Security & Status", keywords: ["success", "completed"] },
  { name: "CheckCircle", icon: CheckCircle, category: "Security & Status", keywords: ["verified", "finished"] },
  { name: "XCircle", icon: XCircle, category: "Security & Status", keywords: ["failure", "cancelled"] },
  { name: "XOctagon", icon: XOctagon, category: "Security & Status", keywords: ["blocked", "forbidden"] },
  { name: "Info", icon: Info, category: "Security & Status", keywords: ["help", "tooltip", "about"] },
  { name: "HelpCircle", icon: HelpCircle, category: "Security & Status", keywords: ["faq", "question", "support"] },
  { name: "Activity", icon: Activity, category: "Security & Status", keywords: ["pulse", "health", "uptime", "telemetry"] },
  { name: "BatteryCharging", icon: BatteryCharging, category: "Security & Status", keywords: ["power", "charging"] },
  { name: "BatteryMedium", icon: BatteryMedium, category: "Security & Status", keywords: ["level", "energy"] },
  { name: "BatteryLow", icon: BatteryLow, category: "Security & Status", keywords: ["warning", "depleted"] },
  { name: "BatteryWarning", icon: BatteryWarning, category: "Security & Status", keywords: ["critical battery"] },

  // Commerce & Productivity
  { name: "CreditCard", icon: CreditCard, category: "Commerce & Data", keywords: ["payment", "billing", "visa", "mastercard"] },
  { name: "Wallet", icon: Wallet, category: "Commerce & Data", keywords: ["funds", "money", "crypto"] },
  { name: "DollarSign", icon: DollarSign, category: "Commerce & Data", keywords: ["currency", "price", "usd"] },
  { name: "Coins", icon: Coins, category: "Commerce & Data", keywords: ["tokens", "cash", "rewards"] },
  { name: "Receipt", icon: Receipt, category: "Commerce & Data", keywords: ["invoice", "bill", "transaction"] },
  { name: "ShoppingBag", icon: ShoppingBag, category: "Commerce & Data", keywords: ["store", "order", "merch"] },
  { name: "ShoppingCart", icon: ShoppingCart, category: "Commerce & Data", keywords: ["checkout", "cart", "buy"] },
  { name: "Tag", icon: Tag, category: "Commerce & Data", keywords: ["label", "badge", "discount"] },
  { name: "Package", icon: Package, category: "Commerce & Data", keywords: ["npm", "bundle", "box", "shipping"] },
  { name: "Box", icon: Box, category: "Commerce & Data", keywords: ["cube", "container", "storage"] },
  { name: "Archive", icon: Archive, category: "Commerce & Data", keywords: ["backup", "compress", "zip"] },
  { name: "Folder", icon: Folder, category: "Commerce & Data", keywords: ["directory", "files"] },
  { name: "FolderPlus", icon: FolderPlus, category: "Commerce & Data", keywords: ["new folder", "organize"] },
  { name: "FolderOpen", icon: FolderOpen, category: "Commerce & Data", keywords: ["active directory"] },
  { name: "File", icon: File, category: "Commerce & Data", keywords: ["document", "page"] },
  { name: "FileText", icon: FileText, category: "Commerce & Data", keywords: ["notes", "article", "doc"] },
  { name: "FileCode2", icon: FileCode2, category: "Commerce & Data", keywords: ["source code", "script"] },
  { name: "FilePlus", icon: FilePlus, category: "Commerce & Data", keywords: ["new document"] },
  { name: "FileCheck", icon: FileCheck, category: "Commerce & Data", keywords: ["approved file"] },
  { name: "Calendar", icon: Calendar, category: "Commerce & Data", keywords: ["date", "schedule", "event"] },
  { name: "CalendarDays", icon: CalendarDays, category: "Commerce & Data", keywords: ["agenda", "month"] },
  { name: "Clock", icon: Clock, category: "Commerce & Data", keywords: ["time", "hours", "watch"] },
  { name: "Timer", icon: Timer, category: "Commerce & Data", keywords: ["stopwatch", "countdown", "duration"] },
  { name: "Bookmark", icon: Bookmark, category: "Commerce & Data", keywords: ["save", "favorite", "ribbon"] },
  { name: "Star", icon: Star, category: "Commerce & Data", keywords: ["rating", "featured", "favorite"] },
  { name: "Award", icon: Award, category: "Commerce & Data", keywords: ["badge", "certificate", "winner"] },
  { name: "Trophy", icon: Trophy, category: "Commerce & Data", keywords: ["first place", "achievement"] },
  { name: "Target", icon: Target, category: "Commerce & Data", keywords: ["goal", "aim", "bullseye", "okr"] },
  { name: "TrendingUp", icon: TrendingUp, category: "Commerce & Data", keywords: ["growth", "increase", "metrics"] },
  { name: "TrendingDown", icon: TrendingDown, category: "Commerce & Data", keywords: ["decrease", "loss"] },
  { name: "BarChart3", icon: BarChart3, category: "Commerce & Data", keywords: ["graph", "analytics", "stats"] },
  { name: "PieChart", icon: PieChart, category: "Commerce & Data", keywords: ["distribution", "breakdown"] },
  { name: "LineChart", icon: LineChart, category: "Commerce & Data", keywords: ["trend", "timeseries"] },
  { name: "Table", icon: Table, category: "Commerce & Data", keywords: ["grid", "data table", "rows"] },

  // Layout & Design
  { name: "LayoutGrid", icon: LayoutGrid, category: "Layout & Design", keywords: ["dashboard", "bento", "mosaic"] },
  { name: "Grid", icon: Grid, category: "Layout & Design", keywords: ["matrix", "layout", "tiles"] },
  { name: "List", icon: List, category: "Layout & Design", keywords: ["ordered", "queue", "rows"] },
  { name: "Columns", icon: Columns, category: "Layout & Design", keywords: ["split", "vertical layout"] },
  { name: "Rows", icon: Rows, category: "Layout & Design", keywords: ["horizontal layout", "stack"] },
  { name: "PanelLeft", icon: PanelLeft, category: "Layout & Design", keywords: ["sidebar", "drawer"] },
  { name: "PanelRight", icon: PanelRight, category: "Layout & Design", keywords: ["inspector", "properties"] },
  { name: "Split", icon: Split, category: "Layout & Design", keywords: ["pane", "divider"] },
  { name: "Palette", icon: Palette, category: "Layout & Design", keywords: ["color", "theme", "art"] },
  { name: "Pipette", icon: Pipette, category: "Layout & Design", keywords: ["eyedropper", "color picker"] },
  { name: "Type", icon: Type, category: "Layout & Design", keywords: ["typography", "font", "text"] },
  { name: "Feather", icon: Feather, category: "Layout & Design", keywords: ["quill", "write", "lightweight"] },
  { name: "Contrast", icon: Contrast, category: "Layout & Design", keywords: ["dark mode", "accessibility"] },
  { name: "Shapes", icon: Shapes, category: "Layout & Design", keywords: ["geometry", "primitives"] },
  { name: "Wand2", icon: Wand2, category: "Layout & Design", keywords: ["magic", "auto-layout", "beautify"] },
  { name: "Layers", icon: Layers, category: "Layout & Design", keywords: ["stack", "z-index", "components"] },
];

const CATEGORIES: IconCategory[] = [
  "All",
  "Navigation",
  "Actions",
  "Communication",
  "Media",
  "Tech & Code",
  "Security & Status",
  "Commerce & Data",
  "Layout & Design",
];

function IconsPage() {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<IconCategory>("All");
  const [previewSize, setPreviewSize] = useState<IconSize>("lg");
  const [copiedIcon, setCopiedIcon] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return GALLERY.filter((entry) => {
      const matchesCategory = selectedCategory === "All" || entry.category === selectedCategory;
      if (!matchesCategory) return false;
      if (!q) return true;

      const matchesName = entry.name.toLowerCase().includes(q);
      const matchesKeywords = entry.keywords?.some((k) => k.toLowerCase().includes(q)) ?? false;
      const matchesCatName = entry.category.toLowerCase().includes(q);
      return matchesName || matchesKeywords || matchesCatName;
    });
  }, [query, selectedCategory]);

  const handleCopy = (name: string) => {
    const importCode = `import { ${name} } from "lucide-react";`;
    navigator.clipboard.writeText(importCode);
    setCopiedIcon(name);
    setTimeout(() => {
      setCopiedIcon((curr) => (curr === name ? null : curr));
    }, 1800);
  };

  return (
    <DocsShell
      eyebrow="Design tokens"
      title="Icons"
      description="Nova wraps lucide-react with a thin, opinionated Icon primitive — enforced accessibility, semantic sizing, and currentColor by default."
      toc={[
        { id: "philosophy", label: "Philosophy" },
        { id: "naming", label: "Naming" },
        { id: "sizes", label: "Sizes" },
        { id: "usage", label: "Usage" },
        { id: "accessibility", label: "Accessibility" },
        { id: "gallery", label: "Gallery" },
        { id: "best-practices", label: "Best practices" },
      ]}
    >
      <DocSection id="philosophy" title="Philosophy">
        <DocLead>
          Icons are typography. They should share weight with the surrounding text — 1.75 stroke,
          currentColor, and a size that snaps to the type scale.
        </DocLead>
        <DocParagraph>
          Nova standardizes on lucide-react for its geometric consistency. The wrapper enforces
          the parts that are easy to get wrong: accessibility semantics and pixel-perfect sizing.
        </DocParagraph>
      </DocSection>

      <DocSection id="naming" title="Naming conventions">
        <ul className="mt-3 list-disc space-y-2 pl-5 text-[14px] text-muted-foreground">
          <li>Import lucide icons in <span className="font-mono text-foreground font-semibold">PascalCase</span> — the module exports match.</li>
          <li>Prefer nouns for state (<span className="font-mono text-foreground">Lock</span>, <span className="font-mono text-foreground">Eye</span>) and verbs for actions (<span className="font-mono text-foreground">Download</span>, <span className="font-mono text-foreground">Edit</span>).</li>
          <li>Match directional icons to reading order: <span className="font-mono text-foreground">ArrowRight</span> for "next", <span className="font-mono text-foreground">ChevronDown</span> for "expand".</li>
        </ul>
      </DocSection>

      <DocSection id="sizes" title="Sizes">
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[520px] border-collapse text-left text-[13px]">
            <thead>
              <tr className="border-b border-border/70 text-[11.5px] uppercase tracking-wide text-muted-foreground">
                <th className="py-2 pr-4 font-medium">Token</th>
                <th className="py-2 pr-4 font-medium">Pixels</th>
                <th className="py-2 pr-4 font-medium">Preview</th>
                <th className="py-2 font-medium">Use</th>
              </tr>
            </thead>
            <tbody>
              {SIZES.map((s) => (
                <tr key={s.name} className="border-b border-border/40">
                  <td className="py-2 pr-4 font-mono">{s.name}</td>
                  <td className="py-2 pr-4 font-mono text-muted-foreground">{s.px}px</td>
                  <td className="py-2 pr-4"><Icon icon={Sparkles} size={s.name} /></td>
                  <td className="py-2 text-muted-foreground">{s.use}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DocSection>

      <DocSection id="usage" title="Usage">
        <CodeBlock
          language="tsx"
          code={`import { Icon } from "@novix-ui/icons";
import { Sparkles } from "lucide-react";

export function Demo() {
  return (
    <>
      {/* Decorative (default) — hidden from assistive tech */}
      <Icon icon={Sparkles} size="sm" />
      {/* Meaningful — requires a label */}
      <Icon icon={Sparkles} decorative={false} label="New feature" />
    </>
  );
}`}
        />
      </DocSection>

      <DocSection id="accessibility" title="Accessibility">
        <Callout variant="accessibility" title="Decorative by default">
          Icons paired with text labels are decorative — Nova hides them from screen readers
          automatically. Standalone icon-only controls MUST provide a <code className="font-mono">label</code>
          or an <code className="font-mono">aria-label</code> on the wrapping button.
        </Callout>
      </DocSection>

      <DocSection id="gallery" title="Gallery">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <DocParagraph>
            Explore 220+ essential curated Nova icons. Click any icon to copy its import snippet.
          </DocParagraph>
          <span className="shrink-0 rounded-full border border-border/80 bg-subtle px-2.5 py-0.5 font-mono text-xs text-muted-foreground">
            {filtered.length} of {GALLERY.length} icons
          </span>
        </div>

        {/* Controls Bar: Search & Size selector */}
        <div className="mt-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="max-w-sm flex-1">
            <Input
              type="search"
              placeholder="Search by name, action, or keyword (e.g. settings, upload, cart)..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search icons"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-muted-foreground">Preview Size:</span>
            <div className="inline-flex rounded-lg border border-border/80 bg-subtle p-0.5">
              {(["xs", "sm", "md", "lg", "xl"] as const).map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => setPreviewSize(sz)}
                  className={`rounded px-2 py-0.5 font-mono text-xs font-medium transition-all ${
                    previewSize === sz
                      ? "bg-foreground text-background shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="mt-4 flex flex-wrap items-center gap-1.5 border-b border-border/60 pb-3">
          {CATEGORIES.map((cat) => {
            const count = cat === "All" ? GALLERY.length : GALLERY.filter((g) => g.category === cat).length;
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-xs transition-all ${
                  isSelected
                    ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                    : "border border-border/60 bg-subtle/50 text-muted-foreground hover:border-border hover:text-foreground"
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                    isSelected ? "bg-primary-foreground/20 text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Icon Grid */}
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
          {filtered.map(({ name, icon: IconComponent, category }) => {
            const isCopied = copiedIcon === name;
            return (
              <button
                key={name}
                type="button"
                onClick={() => handleCopy(name)}
                title={`Click to copy import: import { ${name} } from "lucide-react";`}
                className={`group relative flex flex-col items-center justify-center gap-2.5 rounded-xl border p-3.5 text-center transition-all duration-200 cursor-pointer ${
                  isCopied
                    ? "border-accent bg-accent/15 text-accent shadow-[0_0_16px_rgba(34,211,238,0.3)] scale-105 z-10"
                    : "border-border/60 bg-surface hover:border-border hover:bg-subtle/70 hover:scale-[1.02] hover:shadow-md text-foreground"
                }`}
              >
                <div className="flex h-8 items-center justify-center transition-transform group-hover:scale-110">
                  <Icon icon={IconComponent} size={previewSize} />
                </div>
                <div className="w-full flex flex-col items-center">
                  <span className="w-full truncate font-mono text-[11px] font-medium text-foreground group-hover:text-accent transition-colors">
                    {name}
                  </span>
                  <span className="mt-0.5 truncate font-mono text-[9px] text-muted-foreground">
                    {category}
                  </span>
                </div>

                {/* Copied Toast Banner */}
                {isCopied && (
                  <span className="absolute -top-2 rounded bg-accent px-1.5 py-0.5 font-mono text-[9px] font-bold text-black shadow animate-in fade-in zoom-in-95 duration-150">
                    Copied!
                  </span>
                )}
              </button>
            );
          })}

          {filtered.length === 0 && (
            <div className="col-span-full rounded-2xl border border-dashed border-border/80 p-10 text-center">
              <Icon icon={Search} size="xl" className="mx-auto text-muted-foreground opacity-50 mb-3" />
              <p className="font-medium text-foreground">No icons match "{query}"</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Try searching for a general term like "arrow", "user", "file", or "play".
              </p>
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setSelectedCategory("All");
                }}
                className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 font-mono text-xs text-foreground hover:bg-subtle"
              >
                <RefreshCw size={12} />
                <span>Reset Filters</span>
              </button>
            </div>
          )}
        </div>
      </DocSection>

      <DocSection id="best-practices" title="Best practices">
        <ul className="mt-3 list-disc space-y-2 pl-5 text-[14px] text-muted-foreground">
          <li>Pair icons with text whenever possible — icon-only controls need labels.</li>
          <li>Use <span className="font-mono text-foreground">sm</span> inside buttons and inputs; <span className="font-mono text-foreground">md</span> elsewhere.</li>
          <li>Never restyle stroke width per instance — the 1.75 default keeps the family cohesive.</li>
          <li>Color icons via <span className="font-mono text-foreground">text-*</span> utilities; they inherit <span className="font-mono text-foreground">currentColor</span>.</li>
        </ul>
      </DocSection>
    </DocsShell>
  );
}
