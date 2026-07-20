import { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus, FileText, Shield, Clock, Trash2 } from "lucide-react";
import type { Script } from "@/types";
import { Header } from "@/components/Header";

export const Route = createFileRoute("/app/scripts")({
  component: ScriptsPage,
});

// 预设的3个完整剧本数据（与 certificates-detail.tsx 保持一致）
const presetScripts: Script[] = [
  {
    id: "1",
    title: "都市情感剧：遇见未来",
    description: "一部关于时间旅行与爱情的现代都市剧本",
    coverImage: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=300&fit=crop",
    createdAt: "2026-06-15",
    updatedAt: "2026-06-28",
    status: "published",
    timestampCertificates: [
      { id: "c1", scriptId: "1", certificateNumber: "TSA-2026-001234", timestamp: "2026-06-20", contentHash: "SHA256:a3f8b2c9...", status: "verified", issuedAt: "2026-06-20", validUntil: "2036-06-20" },
      { id: "c2", scriptId: "1", certificateNumber: "TSA-2026-001235", timestamp: "2026-06-25", contentHash: "SHA256:b4g9c3d0...", status: "verified", issuedAt: "2026-06-25", validUntil: "2036-06-25" },
      { id: "c3", scriptId: "1", certificateNumber: "TSA-2026-001237", timestamp: "2026-06-28", contentHash: "SHA256:d6i2e5f8...", status: "verified", issuedAt: "2026-06-28", validUntil: "2036-06-28" },
    ],
  },
  {
    id: "2",
    title: "悬疑推理：迷雾重重",
    description: "一桩离奇案件背后的真相探索",
    coverImage: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=300&fit=crop",
    createdAt: "2026-06-10",
    updatedAt: "2026-06-22",
    status: "draft",
    timestampCertificates: [
      { id: "c4", scriptId: "2", certificateNumber: "TSA-2026-002001", timestamp: "2026-06-18", contentHash: "SHA256:f8k4g7h0...", status: "verified", issuedAt: "2026-06-18", validUntil: "2036-06-18" },
      { id: "c5", scriptId: "2", certificateNumber: "TSA-2026-002004", timestamp: "2026-06-22", contentHash: "SHA256:g0n7j1k4...", status: "verified", issuedAt: "2026-06-22", validUntil: "2036-06-22" },
    ],
  },
  {
    id: "3",
    title: "科幻冒险：星际穿越",
    description: "人类首次深空探索的惊险旅程",
    coverImage: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400&h=300&fit=crop",
    createdAt: "2026-06-05",
    updatedAt: "2026-06-28",
    status: "published",
    timestampCertificates: [
      { id: "c6", scriptId: "3", certificateNumber: "TSA-2026-003001", timestamp: "2026-06-15", contentHash: "SHA256:h0m6i9j2...", status: "verified", issuedAt: "2026-06-15", validUntil: "2036-06-15" },
      { id: "c7", scriptId: "3", certificateNumber: "TSA-2026-003002", timestamp: "2026-06-18", contentHash: "SHA256:i1n7j0k3...", status: "verified", issuedAt: "2026-06-18", validUntil: "2036-06-18" },
      { id: "c8", scriptId: "3", certificateNumber: "TSA-2026-003003", timestamp: "2026-06-22", contentHash: "SHA256:j2o8k1l4...", status: "verified", issuedAt: "2026-06-22", validUntil: "2036-06-22" },
      { id: "c9", scriptId: "3", certificateNumber: "TSA-2026-003004", timestamp: "2026-06-25", contentHash: "SHA256:k3p9l2m5...", status: "verified", issuedAt: "2026-06-25", validUntil: "2036-06-25" },
      { id: "c10", scriptId: "3", certificateNumber: "TSA-2026-003005", timestamp: "2026-06-28", contentHash: "SHA256:l4q0m3n6...", status: "verified", issuedAt: "2026-06-28", validUntil: "2036-06-28" },
    ],
  },
];

// 预设剧本的完整内容和轨迹数据
const presetData = {
  "1": {
    content: `# 第一幕：相遇

场景：咖啡馆
时间：下午3点
人物：李明（28岁，软件工程师）、张薇（26岁，设计师）

【窗外下着淅沥的小雨，咖啡馆里弥漫着浓郁的咖啡香气。李明坐在靠窗的位置，手指轻轻敲击着桌面，眼神不时望向门口。】

李明：（自言自语，看了看手表）她怎么还没来...已经迟到十五分钟了。

【门铃响起，清脆的声音打破了店内的安静。张薇推门而入，头发微湿，脸上带着歉意的微笑。她环顾四周，目光锁定在李明身上。】

张薇：（快步走来）抱歉抱歉，路上堵车太严重了，地铁又临时停运...

李明：（起身帮她拉开椅子）没关系，我也刚到不久。坐吧，外面雨挺大的。

张薇：（坐下，从包里拿出纸巾擦头发）谢谢。你点了什么？

李明：美式咖啡。你要喝点什么？我请客。

张薇：那就拿铁吧，加一份浓缩。

【李明起身去吧台点单。张薇看着他的背影，嘴角微微上扬。窗外的雨声渐渐变大，咖啡馆里的爵士乐轻柔地流淌。】

李明：（端着两杯咖啡回来）给，你的拿铁。

张薇：（接过咖啡，轻抿一口）嗯，味道不错。这家店你常来吗？

李明：偶尔会来，喜欢这里的氛围。安静，适合思考。

张薇：我也是。其实我之前就注意到你了，每次来都坐在同一个位置，对着笔记本电脑敲代码。

李明：（有些惊讶）你观察得这么仔细？

张薇：（笑）设计师的职业病嘛，对细节比较敏感。

【两人相视一笑，气氛逐渐融洽。窗外的雨还在下，但咖啡馆内却温暖如春。】

---

# 第二幕：冲突

场景：李明的办公室
时间：晚上8点
人物：李明、张薇、王总（部门经理）

【办公室里只剩下李明一个人，电脑屏幕的光映在他疲惫的脸上。桌上堆满了文件，垃圾桶里塞满了揉皱的纸团。】

李明：（揉了揉太阳穴，叹了口气）这个bug到底在哪里...

【门被推开，张薇走了进来，手里提着外卖袋。】

张薇：你还在工作？我都给你打了三个电话了。

李明：（抬头，露出疲惫的笑容）这个项目明天就要交了，还有一个关键bug没解决。

张薇：（把外卖放在桌上）先吃饭吧，身体要紧。我给你带了粥和小菜。

李明：你先回去吧，我弄完这点就回去。

张薇：（皱眉）李明，我们已经两周没有好好吃过一顿饭了。你这样下去会累垮的。

李明：我知道，但是...

【王总突然出现在门口。】

王总：李明，客户那边催得很紧，明天早上必须看到成品。你能搞定吗？

李明：（坚定地点头）没问题，今晚一定完成。

王总：好，辛苦了。（离开）

张薇：（看着王总的背影，转头对李明）你看看你，为了这个项目都快把自己逼疯了。

李明：这是我的责任。而且，我想证明给你看，我可以做到。

张薇：我不需要你证明什么，我只希望你健康。

【李明沉默了片刻，放下手中的键盘。】

李明：你说得对。来，一起吃饭吧。

【两人坐在办公桌前，默默地吃着晚餐。窗外的城市灯火通明，办公室里的灯光显得格外温暖。】

---

# 第三幕：和解

场景：城市公园的长椅
时间：黄昏
人物：李明、张薇

【夕阳西下，天空被染成橙红色。公园里散步的人不多，偶尔有几只鸽子在地上觅食。李明和张薇并肩坐在长椅上，手里各拿着一杯奶茶。】

李明：（望着远方）其实我一直想跟你说...

张薇：（转头看他）说什么？

李明：谢谢你一直陪着我。这段时间我工作压力很大，有时候脾气也不好，但你从来没有抱怨过。

张薇：（微笑）因为我知道你在为什么而努力。而且，我也不是完全没有怨言的，只是没说出口而已。

李明：（苦笑）我就知道。

张薇：但是，看到你为了梦想拼搏的样子，我觉得很骄傲。虽然有时候会很担心你的身体，但更多的是敬佩。

李明：（握住她的手）以后我会注意的。工作重要，但你更重要。

张薇：（反握住他的手）那我们说好了，以后每周至少一起吃三次饭，不许加班到太晚。

李明：好，我答应你。

【夕阳的余晖洒在两人身上，拉出长长的影子。远处的钟楼传来悠扬的钟声，仿佛在见证这一刻的美好。】

张薇：对了，我有个好消息要告诉你。

李明：什么好消息？

张薇：我接到了一家知名设计公司的offer，下周就要去上海工作了。

李明：（愣住）上海？那...那我们...

张薇：（笑着打断他）别紧张，是远程办公。我可以在家工作，偶尔去上海开会就行。

李明：（松了口气）吓死我了。我还以为你要离开我了。

张薇：傻瓜，我怎么舍得离开你。

【两人相拥而坐，夕阳渐渐沉入地平线，夜幕缓缓降临。城市的灯光一盏盏亮起，如同繁星点点。】

【幕落】`,
    stage: "final",
    activityLog: [
      { id: "1-1", type: "manual", content: "输入故事大纲：都市背景下的爱情故事，探讨工作与生活的平衡", timestamp: "14:30:00", stage: "idea" },
      { id: "1-2", type: "ai", prompt: "生成主要角色设定 - 李明和张薇的角色档案", result: "生成了详细的角色背景、性格特点、职业信息", timestamp: "14:32:15", stage: "idea" },
      { id: "1-3", type: "manual", content: "调整角色性格：李明更加内敛务实，张薇更加活泼细腻", timestamp: "14:35:28", stage: "idea" },
      { id: "1-4", type: "ai", prompt: "生成三个可能的故事冲突点", result: "提供了工作压力、异地恋、家庭反对三种冲突方案", timestamp: "14:38:00", stage: "idea" },
      { id: "1-5", type: "manual", content: "选择工作压力作为主要冲突，增加异地元素作为次要冲突", timestamp: "14:40:30", stage: "idea" },
      { id: "1-6", type: "timestamp", content: "申请构思阶段可信时间戳认证", certNumber: "TSA-2026-001234", timestamp: "14:45:00", stage: "idea" },
      { id: "1-7", type: "ai", prompt: "生成第一幕开场对话 - 咖啡馆相遇场景", result: "生成了包含环境描写和对话的完整场景", timestamp: "09:15:00", stage: "draft" },
      { id: "1-8", type: "manual", content: "修改对话节奏，增加停顿和眼神交流描写，使互动更自然", timestamp: "09:20:30", stage: "draft" },
      { id: "1-9", type: "ai", prompt: "优化环境描写，增加雨天氛围 - 雨声、雾气、咖啡香气", result: "增强了感官细节，使场景更具沉浸感", timestamp: "09:25:45", stage: "draft" },
      { id: "1-10", type: "manual", content: "编写第二幕办公室冲突场景，加入上司角色增加戏剧张力", timestamp: "09:30:00", stage: "draft" },
      { id: "1-11", type: "ai", prompt: "生成第三幕和解场景的情感高潮", result: "生成了公园夕阳下的温馨对话", timestamp: "16:10:00", stage: "revise" },
      { id: "1-12", type: "manual", content: "添加异地工作的剧情转折，增加故事的层次感", timestamp: "16:15:30", stage: "revise" },
      { id: "1-13", type: "timestamp", content: "申请初稿阶段可信时间戳认证", certNumber: "TSA-2026-001235", timestamp: "16:20:15", stage: "draft" },
      { id: "1-14", type: "manual", content: "润色全部对话，统一人物语言风格", timestamp: "09:30:00", stage: "revise" },
      { id: "1-15", type: "ai", prompt: "检查剧本结构完整性，提供修改建议", result: "建议增加更多内心独白和环境呼应", timestamp: "09:35:00", stage: "revise" },
      { id: "1-16", type: "manual", content: "根据建议补充内心独白，增强情感表达", timestamp: "09:40:00", stage: "revise" },
      { id: "1-17", type: "timestamp", content: "申请定稿阶段可信时间戳认证", certNumber: "TSA-2026-001237", timestamp: "09:45:12", stage: "final" },
    ],
  },
  "2": {
    content: `# 第一章：案发

场景：城郊别墅区，王建国家
时间：凌晨3点
人物：陈刚（刑警队长）、小李（年轻刑警）、法医老张

【暴雨倾盆，雷声轰鸣。警笛声划破寂静的夜空，红蓝交替的警灯在雨幕中闪烁。一辆警车停在别墅门口，陈刚撑着伞快步走向大门。】

陈刚：（对身后的小李）现场保护得怎么样？

小李：已经封锁了，除了我们和法医，其他人都不让进。

陈刚：好，进去看看。

【推开别墅大门，一股浓烈的血腥味扑面而来。客厅的灯光昏暗，地上躺着一具男尸。死者身穿睡衣，仰面朝天，胸口有一处明显的刀伤。】

法医老张：（蹲在尸体旁检查）死亡时间大约在凌晨1点到2点之间。致命伤是胸口的这一刀，直接刺穿了心脏。

陈刚：（环顾四周）门窗情况如何？

小李：（指着正门）正门的锁完好无损，没有被撬的痕迹。但是...（指向书房窗户）书房的窗户是开着的。

陈刚：（走到书房）窗户是从里面打开的还是外面？

小李：从里面。窗台上没有脚印，应该是死者自己打开的。

陈刚：（皱眉）这就奇怪了。如果是自杀，为什么会把窗户打开？如果是他杀，凶手是怎么进来的？

【陈刚回到客厅，仔细观察尸体。死者的右手紧紧握拳，似乎在临死前抓住了什么东西。】

陈刚：老张，他手里握着什么？

法医老张：（小心地掰开死者的手指）是一枚钥匙。看起来很普通，像是某种储物柜或者保险箱的钥匙。

陈刚：（接过钥匙，仔细端详）这枚钥匙很重要。小李，你去查一下死者的人际关系，特别是最近有没有和人发生过矛盾。

小李：是！

【陈刚站起身，目光落在墙上的挂钟上。时钟的指针停在凌晨2:17。】

陈刚：2点17分...这个时间点很关键。老张，能确定具体的死亡时间吗？

法医老张：根据尸温和血液凝固程度，死亡时间在凌晨1点到3点之间。2点17分可能是时钟停止的时间，但不一定是死亡时间。

陈刚：（若有所思）时钟为什么会停？是被人为破坏的吗？

【陈刚走近挂钟，发现时钟背面有一个小小的凹痕，像是被什么东西撞击过。】

陈刚：有意思。看来这个案子没那么简单。

---

# 第二章：嫌疑人

场景：刑警队会议室
时间：第二天上午9点
人物：陈刚、小李、小王（女刑警）

【会议室的白板上贴满了照片和线索。陈刚站在白板前，手里拿着马克笔。】

陈刚：好，我们来梳理一下目前掌握的情况。死者王建国，52岁，宏达集团董事长，身价过亿。昨晚凌晨1点到3点之间在家中遇害，致命伤是胸口一刀。

小王：人际关系方面有什么发现？

小李：（翻看笔记）主要有四个嫌疑人。第一个是死者的妻子刘芳，45岁，全职太太。据邻居反映，两人最近经常吵架，关系紧张。

陈刚：动机呢？

小李：遗产。如果王建国去世，刘芳将继承大部分财产。而且，有人看到案发当晚刘芳曾经离开过家，说是去便利店买东西，但便利店老板说没见到她。

小王：第二个嫌疑人是谁？

小李：死者的商业伙伴赵明，48岁。两人最近因为一个项目产生了严重分歧，据说还发生了肢体冲突。赵明有作案时间，案发当晚他的行踪不明。

陈刚：第三个呢？

小李：死者的私人秘书林雪，30岁。她和死者的关系...有些暧昧。有人看到他们多次单独出入酒店。而且，林雪最近一直在打听死者的遗嘱内容。

小王：第四个？

小李：死者的儿子王浩，25岁，刚从国外留学回来。他和父亲的关系很差，曾多次公开表示不满父亲的管教方式。案发当晚，王浩声称自己在酒吧喝酒，但没有证人。

陈刚：（在白板上写下四个名字）四个人都有动机和作案时间。我们需要进一步调查。小王，你去查刘芳的行踪，确认她当晚到底去了哪里。小李，你负责调查赵明和林雪，特别是他们和王建国的财务往来。我去见见王浩。

小王：收到！

【陈刚拿起桌上的那枚钥匙，若有所思。】

陈刚：这枚钥匙...到底能打开什么呢？

---

# 第三章：线索

场景：王建国的书房
时间：第二天下午2点
人物：陈刚、技术科小刘

【陈刚再次来到案发现场，这次带着技术科的同事。书房的布置简洁而奢华，书架上摆满了各种书籍和奖杯。】

技术科小刘：陈队，我们检查了整栋房子，发现了一个隐藏的保险箱。

陈刚：在哪里？

小刘：（指向书桌后面的墙壁）这里。需要指纹和密码才能打开。

陈刚：指纹采集到了吗？

小刘：采集到了，是死者的指纹。但是密码还不知道。

陈刚：（拿出那枚钥匙）这枚钥匙会不会和密码有关？

小刘：有可能。让我试试。

【小刘将钥匙插入保险箱侧面的一个小孔，转动了几下。保险箱发出"咔哒"一声，门缓缓打开。】

陈刚：（凑近查看）里面有什么？

小刘：（取出里面的物品）一本日记、几份合同，还有...一封遗书？

陈刚：（接过遗书，仔细阅读）"如果我遭遇不测，凶手一定是..."后面的字被撕掉了。

小刘：被人故意撕掉的？

陈刚：看来有人不想让我们知道真相。把日记和合同带回去仔细检查，看看能不能找到线索。

【陈刚的目光落在书桌抽屉上。他拉开抽屉，发现里面有一部老式的手机。】

陈刚：这部手机...为什么会被藏在这里？

小刘：需要检查一下吗？

陈刚：当然。看看里面有什么秘密。

【窗外的雨还在下，仿佛在为这个未解的谜团哭泣。】

【未完待续】`,
    stage: "draft",
    activityLog: [
      { id: "2-1", type: "ai", prompt: "生成悬疑故事的三个开头方案", result: "提供了雨夜密室杀人、失踪案回归、神秘信件三种方案", timestamp: "10:30:00", stage: "idea" },
      { id: "2-2", type: "manual", content: "选择第一个方案：雨夜中的密室杀人案，增加钥匙线索", timestamp: "10:35:15", stage: "idea" },
      { id: "2-3", type: "ai", prompt: "设计侦探角色 - 陈刚的性格和背景", result: "生成了经验丰富的刑警形象，擅长逻辑推理", timestamp: "10:40:00", stage: "idea" },
      { id: "2-4", type: "ai", prompt: "设计四个嫌疑人的基本信息和动机", result: "生成了妻子、商业伙伴、秘书、儿子四个角色", timestamp: "10:42:30", stage: "idea" },
      { id: "2-5", type: "manual", content: "调整嫌疑人关系网，增加复杂性", timestamp: "10:44:00", stage: "idea" },
      { id: "2-6", type: "timestamp", content: "申请构思阶段可信时间戳认证", certNumber: "TSA-2026-002002", timestamp: "10:45:15", stage: "idea" },
      { id: "2-7", type: "manual", content: "编写故事大纲：密室杀人案的三章结构", timestamp: "15:20:30", stage: "outline" },
      { id: "2-8", type: "ai", prompt: "优化大纲结构，增加悬念设置", result: "建议在每章结尾留下悬念", timestamp: "15:25:00", stage: "outline" },
      { id: "2-9", type: "timestamp", content: "申请大纲阶段可信时间戳认证", certNumber: "TSA-2026-002001", timestamp: "15:20:30", stage: "outline" },
      { id: "2-10", type: "ai", prompt: "生成第一章案发现场的详细描写", result: "生成了包含环境、尸体、线索的完整场景", timestamp: "14:15:00", stage: "draft" },
      { id: "2-11", type: "manual", content: "增加法医鉴定细节，使死亡时间推断更专业", timestamp: "14:20:30", stage: "draft" },
      { id: "2-12", type: "ai", prompt: "生成第二章嫌疑人介绍的场景", result: "生成了会议室讨论和四个嫌疑人的详细信息", timestamp: "14:22:00", stage: "draft" },
      { id: "2-13", type: "manual", content: "调整对话，使刑警之间的互动更自然", timestamp: "14:23:30", stage: "draft" },
      { id: "2-14", type: "ai", prompt: "生成第三章发现隐藏线索的场景", result: "生成了保险箱、遗书、老式手机的发现过程", timestamp: "14:25:00", stage: "draft" },
      { id: "2-15", type: "manual", content: "增加遗书被撕掉的情节，制造新的悬念", timestamp: "14:27:00", stage: "draft" },
      { id: "2-16", type: "timestamp", content: "申请初稿阶段可信时间戳认证", certNumber: "TSA-2026-002004", timestamp: "14:30:00", stage: "draft" },
    ],
  },
  "3": {
    content: `# 第一章：出发

场景：地球联合航天中心，发射台
时间：2150年6月1日，上午8点
人物：李昂（指挥官）、苏珊（副指挥官）、马克（工程师）、艾娃（AI导航系统）

【清晨的阳光洒在巨大的发射台上，"探索者号"飞船巍然矗立，银白色的外壳在阳光下闪闪发光。这艘长达三百米的巨型飞船是人类科技的巅峰之作，承载着寻找新家园的希望。周围聚集了数万名观众，他们屏息凝视，等待着历史性的时刻。】

李昂：（站在指挥舱内，透过舷窗望着下方的欢呼人群）准备好了吗？

苏珊：（检查仪表盘）所有系统正常。曲速引擎充能98%，生命维持系统运转良好，船员全部就位。

马克：（从引擎室通讯）曲速核心稳定，可以随时启动。

李昂：艾娃，导航系统状态？

艾娃：（柔和的女声）导航系统在线，目标星系坐标已锁定。预计航行时间：标准时间6个月。警告：途中将经过一个不稳定黑洞区域，建议谨慎操作。

李昂：收到。全体注意，倒计时开始。10、9、8...

【控制室内，所有人都紧盯着屏幕。倒计时归零的瞬间，飞船底部喷射出耀眼的蓝色火焰。】

李昂：3、2、1，发射！

【巨大的推力将飞船缓缓推离地面，加速冲向天空。地面的欢呼声逐渐远去，取而代之的是引擎的轰鸣。飞船穿过大气层，进入太空。蓝色的地球在舷窗外逐渐变小，最终变成一颗美丽的蓝色弹珠。】

苏珊：（松了一口气）我们成功了。

李昂：（望着远去的地球，眼中闪烁着复杂的情感）这只是开始。真正的挑战还在前面。

---

# 第二章：黑洞边缘

场景：探索者号指挥舱
时间：航行第45天
人物：李昂、苏珊、马克、艾娃

【飞船正在接近目标星系边缘的一个黑洞。黑色的漩涡在太空中缓缓旋转，周围的星光被扭曲成奇异的光环。指挥舱内的警报声此起彼伏。】

艾娃：警告！引力异常加剧，时空扭曲指数达到危险级别。建议立即改变航向。

李昂：（紧盯着屏幕）不能改变航向，这是最短的路径。马克，曲速引擎能承受多大的引力？

马克：（满头大汗）理论上可以承受当前引力的1.5倍，但我们现在已经达到了1.3倍。再靠近就很危险了。

苏珊：李昂，也许我们应该绕路。多花一个月时间，但更安全。

李昂：（沉思片刻）我们的补给只够6个月。绕路的话，可能无法到达目的地。艾娃，计算一下以当前速度穿越黑洞的成功率。

艾娃：计算中...成功率约为73%。如果调整曲速频率，可以将成功率提高到85%。

李昂：那就调整频率。马克，准备执行。

马克：（犹豫）指挥官，这太冒险了。

李昂：我们没有选择。执行命令。

【马克深吸一口气，开始在控制面板上操作。曲速引擎发出低沉的嗡鸣，频率逐渐改变。飞船周围的时空开始剧烈扭曲，星光拉长成无数条光线。】

艾娃：曲速频率调整完成。准备穿越。3、2、1...

【飞船冲入黑洞的事件视界。一瞬间，所有的声音都消失了。时间仿佛静止，空间变得扭曲。船员们感到一阵强烈的眩晕，眼前的景象变得光怪陆离。】

苏珊：（抓住扶手）我感觉...好像看到了过去和未来...

李昂：（努力保持清醒）坚持住！很快就会过去的！

【几秒钟后，飞船冲出黑洞的另一端。星光恢复正常，警报声停止。】

艾娃：穿越成功。我们已进入目标星系。

李昂：（擦了擦额头的汗水）干得好，大家。最危险的阶段已经过去了。

苏珊：（看着舷窗外陌生的星空）这就是我们要寻找的新家园吗？

李昂：也许是。让我们去看看。

---

# 第三章：异星文明

场景：未知行星表面
时间：航行第120天
人物：李昂、苏珊、马克、外星使者

【探索者号降落在一片紫色的平原上。天空中悬挂着两颗卫星，散发出柔和的光芒。远处是奇特的晶体山脉，在阳光下折射出七彩的光芒。】

李昂：（穿着宇航服，踏上外星土地）重力比地球略低，空气成分...含有氧气，可以直接呼吸。

苏珊：（摘下头盔，深吸一口气）真的可以呼吸！这太不可思议了。

马克：（拿着扫描仪）土壤中含有丰富的矿物质，适合植物生长。这里可能是一个理想的殖民星球。

【突然，地面开始震动。远处的晶体山脉中走出几个身影。它们有着透明的身体，内部流动着彩色的光芒。】

外星使者：（通过心灵感应传达信息）欢迎来到我们的家园，来自远方的旅人。

李昂：（惊讶）你们...能和我们交流？

外星使者：我们可以感知你们的思维。我们是硅基生命体，以能量为食，已经在这个星球上生活了数百万年。

苏珊：你们知道我们在寻找新家园吗？

外星使者：我们知道。我们也曾面临灭绝的危机，直到我们学会了与星球和谐共处。也许，我们可以分享彼此的知识。

李昂：（激动地）这意味着...我们可以和平共存？

外星使者：宇宙足够大，容得下不同的生命形式。关键在于，你们是否愿意学习尊重和理解。

【李昂望向身边的同伴，眼中充满了希望。这一刻，人类不再孤独。】

【未完待续】`,
    stage: "revise",
    activityLog: [
      { id: "3-1", type: "ai", prompt: "生成2150年的科幻世界观设定", result: "生成了科技水平、社会结构、能源危机背景", timestamp: "09:00:00", stage: "idea" },
      { id: "3-2", type: "manual", content: "调整科技设定，确保符合硬科幻标准，咨询物理学知识", timestamp: "09:10:00", stage: "idea" },
      { id: "3-3", type: "ai", prompt: "设计主角团队的角色配置", result: "生成了指挥官、副官、工程师、AI四个核心角色", timestamp: "09:15:00", stage: "idea" },
      { id: "3-4", type: "manual", content: "增加AI角色的个性设定，使其更有存在感", timestamp: "09:18:00", stage: "idea" },
      { id: "3-5", type: "timestamp", content: "申请构思阶段可信时间戳认证", certNumber: "TSA-2026-003001", timestamp: "09:30:00", stage: "idea" },
      { id: "3-6", type: "ai", prompt: "设计三种不同形态的外星文明", result: "生成了硅基生命、能量生命、量子生命三种形态及特点", timestamp: "13:00:00", stage: "outline" },
      { id: "3-7", type: "manual", content: "选择硅基生命作为主要接触对象，设计其外观和交流方式", timestamp: "13:05:00", stage: "outline" },
      { id: "3-8", type: "manual", content: "编写五章剧情大纲：出发、黑洞、异星、抉择、归途", timestamp: "13:10:30", stage: "outline" },
      { id: "3-9", type: "ai", prompt: "优化大纲结构，增加情节转折点", result: "建议在黑洞穿越时增加时间 dilation 效应", timestamp: "13:12:00", stage: "outline" },
      { id: "3-10", type: "timestamp", content: "申请大纲阶段可信时间戳认证", certNumber: "TSA-2026-003002", timestamp: "13:15:30", stage: "outline" },
      { id: "3-11", type: "ai", prompt: "生成第一章发射场景的详细描写", result: "生成了包含环境、人物、倒计时的完整发射场景", timestamp: "10:15:00", stage: "draft" },
      { id: "3-12", type: "manual", content: "增加主角内心独白，展现对未知的恐惧与期待", timestamp: "10:20:30", stage: "draft" },
      { id: "3-13", type: "ai", prompt: "生成第二章黑洞穿越的科幻场景", result: "生成了时空扭曲、视觉奇观、心理体验的描写", timestamp: "10:22:00", stage: "draft" },
      { id: "3-14", type: "manual", content: "修正曲速引擎和虫洞的科学描述，咨询物理顾问", timestamp: "10:25:00", stage: "draft" },
      { id: "3-15", type: "ai", prompt: "生成第三章外星文明首次接触的场景", result: "生成了紫色平原、晶体山脉、硅基生命的出场", timestamp: "10:27:00", stage: "draft" },
      { id: "3-16", type: "manual", content: "增加外星使者的对话，体现其智慧和善意", timestamp: "10:28:30", stage: "draft" },
      { id: "3-17", type: "timestamp", content: "申请初稿阶段可信时间戳认证", certNumber: "TSA-2026-003003", timestamp: "10:30:00", stage: "draft" },
      { id: "3-18", type: "manual", content: "根据科学顾问意见修改物理定律描述，增加准确性", timestamp: "15:30:00", stage: "revise" },
      { id: "3-19", type: "ai", prompt: "重新生成黑洞穿越场景，增加视觉冲击力和科学准确性", result: "增加了引力透镜效应和时间膨胀的描写", timestamp: "15:35:15", stage: "revise" },
      { id: "3-20", type: "manual", content: "调整角色关系，增加团队内部的冲突和磨合", timestamp: "15:38:00", stage: "revise" },
      { id: "3-21", type: "ai", prompt: "优化外星文明的交流方式，使其更独特", result: "改为心灵感应+彩色光芒的组合方式", timestamp: "15:40:00", stage: "revise" },
      { id: "3-22", type: "manual", content: "增加环境描写的细节，使外星世界更真实可感", timestamp: "15:42:00", stage: "revise" },
      { id: "3-23", type: "timestamp", content: "申请修改阶段可信时间戳认证", certNumber: "TSA-2026-003004", timestamp: "15:45:00", stage: "revise" },
    ],
  },
};

// 从 localStorage 加载剧本数据
function loadScripts(): Script[] {
  // 强制重新初始化预设数据（用于更新预设剧本内容）
  initializePresetData();

  const saved = localStorage.getItem("userScripts");
  if (saved) {
    try {
      const userScripts: Script[] = JSON.parse(saved);
      // 合并预设剧本和用户创建的剧本
      return [...presetScripts, ...userScripts.filter((s: Script) => !["1", "2", "3"].includes(s.id))];
    } catch {
      return presetScripts;
    }
  }

  return presetScripts;
}

// 初始化预设剧本的内容和轨迹数据
function initializePresetData() {
  Object.entries(presetData).forEach(([scriptId, data]) => {
    // 保存内容
    localStorage.setItem(`script_content_${scriptId}`, data.content);
    // 保存阶段
    localStorage.setItem(`script_stage_${scriptId}`, data.stage);
    // 保存轨迹
    localStorage.setItem(`script_activity_${scriptId}`, JSON.stringify(data.activityLog));
  });
}

function saveScripts(scripts: Script[]) {
  // 只保存用户创建的剧本（排除预设剧本）
  const userScripts = scripts.filter((s) => !["1", "2", "3"].includes(s.id));
  localStorage.setItem("userScripts", JSON.stringify(userScripts));
}

function getStatusColor(status: Script["status"]) {
  switch (status) {
    case "published":
      return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
    case "draft":
      return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
    case "archived":
      return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

function getStatusText(status: Script["status"]) {
  switch (status) {
    case "published":
      return "已发布";
    case "draft":
      return "草稿";
    case "archived":
      return "已归档";
    default:
      return status;
  }
}

function ScriptCard({ script, onDelete }: { script: Script; onDelete: (id: string) => void }) {
  const certCount = script.timestampCertificates?.length || 0;
  const isPreset = ["1", "2", "3"].includes(script.id);

  return (
    <div className="group relative">
      <Link to="/app/editor" search={{ scriptId: script.id }}>
        <div className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer">
          <div className="relative aspect-video bg-muted">
            {script.coverImage ? (
              <img
                src={script.coverImage}
                alt={script.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <FileText className="w-12 h-12 text-muted-foreground" />
              </div>
            )}
            <div className={`absolute top-2 right-2 px-2 py-1 rounded-md text-xs font-medium ${getStatusColor(script.status)}`}>
              {getStatusText(script.status)}
            </div>
          </div>
          <div className="p-4 space-y-3">
            <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
              {script.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {script.description}
            </p>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{script.updatedAt}</span>
              </div>
              {certCount > 0 && (
                <div className="flex items-center gap-1 text-primary">
                  <Shield className="w-3 h-3" />
                  <span>{certCount}个证书</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
      
      {/* 删除按钮（仅用户创建的剧本显示） */}
      {!isPreset && (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDelete(script.id);
          }}
          className="absolute top-2 left-2 p-2 bg-red-500/90 hover:bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
          title="删除剧本"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

function ScriptsPage() {
  const [scripts, setScripts] = useState<Script[]>([]);
  const [showNewScriptModal, setShowNewScriptModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");

  useEffect(() => {
    setScripts(loadScripts());
  }, []);

  const handleCreateScript = () => {
    if (!newTitle.trim()) return;
    
    const newScript: Script = {
      id: Date.now().toString(),
      title: newTitle,
      description: newDescription || "暂无描述",
      coverImage: "",
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
      status: "draft",
      timestampCertificates: [],
    };
    
    const updatedScripts = [newScript, ...scripts];
    setScripts(updatedScripts);
    saveScripts(updatedScripts);
    setShowNewScriptModal(false);
    setNewTitle("");
    setNewDescription("");
  };

  const handleDeleteScript = (scriptId: string) => {
    const updatedScripts = scripts.filter((s) => s.id !== scriptId);
    setScripts(updatedScripts);
    saveScripts(updatedScripts);
    setShowDeleteConfirm(null);
    
    // 清理该剧本的相关数据
    localStorage.removeItem(`script_content_${scriptId}`);
    localStorage.removeItem(`script_stage_${scriptId}`);
    localStorage.removeItem(`script_activity_${scriptId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">我的剧本</h1>
            <p className="text-muted-foreground">管理你的创作作品，保护原创版权</p>
          </div>
          <button
            onClick={() => setShowNewScriptModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>新建剧本</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {scripts.map((script) => (
            <ScriptCard key={script.id} script={script} onDelete={(id) => setShowDeleteConfirm(id)} />
          ))}
        </div>

        {scripts.length === 0 && (
          <div className="text-center py-16">
            <FileText className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">暂无剧本</h3>
            <p className="text-muted-foreground mb-4">开始你的第一个创作吧</p>
            <button
              onClick={() => setShowNewScriptModal(true)}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              创建剧本
            </button>
          </div>
        )}
      </div>

      {/* 新建剧本弹窗 */}
      {showNewScriptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-card rounded-xl border border-border p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">新建剧本</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">剧本标题</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="请输入剧本标题"
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/20 outline-none"
                  autoFocus
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">简介（可选）</label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="简单描述一下你的剧本"
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/20 outline-none resize-none h-20"
                />
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => { setShowNewScriptModal(false); setNewTitle(""); setNewDescription(""); }}
                className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleCreateScript}
                disabled={!newTitle.trim()}
                className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                创建
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 删除确认弹窗 */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-card rounded-xl border border-border p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">确认删除</h3>
            <p className="text-sm text-muted-foreground mb-6">
              确定要删除这个剧本吗？此操作不可恢复。
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
              >
                取消
              </button>
              <button
                onClick={() => handleDeleteScript(showDeleteConfirm)}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
