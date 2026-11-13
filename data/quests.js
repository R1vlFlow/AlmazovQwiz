// Original exercises, not copies of the source files. Editorial status: pilot.
const MQ_SOURCES = {
  latin: {title:'Общий глоссарий по латинскому языку',url:'https://drive.google.com/file/d/1_m5SXEf6NucSFKpWb3vg1klf0KRHtPRH/view',locator:'Алфавитные статьи по указанным терминам'},
  cell: {title:'Биология человека · практическое занятие 3',url:'https://drive.google.com/file/d/1nXyiTNJXwb2fhZNoZRZpVnCL1q0ZgIca/view',locator:'Блок 1: хроматин, ядерная оболочка, поры, ядрышко'},
  histo: {title:'ССС и кровь · гистология',url:'https://drive.google.com/file/d/1f3kIp3Fbxcq8K07KQXZE_eu1qBLHoZbW/view',locator:'Разделы о стенке сердца и составе крови'},
  nucleus: {title:'OpenStax · Nucleus and DNA Replication',url:'https://openstax.org/books/anatomy-and-physiology-2e/pages/3-3-the-nucleus-and-dna-replication',locator:'Organization of the Nucleus and Its DNA'},
  heart: {title:'OpenStax · Heart Anatomy',url:'https://openstax.org/books/anatomy-and-physiology-2e/pages/19-1-heart-anatomy',locator:'Layers'},
  blood: {title:'OpenStax · An Overview of Blood',url:'https://openstax.org/books/anatomy-and-physiology-2e/pages/18-1-an-overview-of-blood',locator:'Composition of Blood'}
};
const MQ_PACKS = [
  {id:'latin',number:'01',title:'Язык анатомии',subject:'Латинский язык',symbol:'Aa',color:'mint',description:'Различайте похожие слова, собирайте пары и вспоминайте термины без подсказок.',minutes:8},
  {id:'cell',number:'02',title:'Внутри ядра',subject:'Клеточная биология',symbol:'◎',color:'lilac',description:'От оболочки до хроматина: разберите устройство клеточного центра управления.',minutes:8},
  {id:'histo',number:'03',title:'Сердце под микроскопом',subject:'Гистология',symbol:'♡',color:'peach',description:'Пройдите слои сердечной стенки и разберитесь с компонентами крови.',minutes:8}
];
const MQ_TASKS = [
  {id:'l1',pack:'latin',type:'single',prompt:'Какой термин означает «сердце»?',options:['cor','corpus','collum','costa'],answer:0,explanation:'Cor — сердце; corpus — тело; collum — шейка; costa — ребро.'},
  {id:'l2',pack:'latin',type:'match',prompt:'Соедините орган и латинское название.',left:['Печень','Лёгкое','Почка'],right:['ren','hepar','pulmo'],answer:[1,2,0],explanation:'Hepar — печень, pulmo — лёгкое, ren — почка.'},
  {id:'l3',pack:'latin',type:'text',prompt:'Напишите по-латыни «ребро» в именительном падеже единственного числа.',answers:['costa'],explanation:'Словарная форма: costa, ae f.'},
  {id:'l4',pack:'latin',type:'multi',prompt:'Выберите все термины, обозначающие кости.',options:['clavicula','scapula','glandula','humerus'],answer:[0,1,3],explanation:'Ключица, лопатка и плечевая кость. Glandula — железа.'},
  {id:'l5',pack:'latin',type:'match',prompt:'Соберите пары противоположных направлений.',left:['dexter','superior','internus'],right:['externus','sinister','inferior'],answer:[1,2,0],explanation:'Правый ↔ левый; верхний ↔ нижний; внутренний ↔ наружный.'},
  {id:'l6',pack:'latin',type:'single',scenario:'В карточке написано «os». Студент переводит слово как «кость», не проверяя словарную форму.',prompt:'Какая форма однозначно подтверждает этот перевод?',options:['os, oris n','os, ossis n','auris, is f'],answer:1,explanation:'Os, ossis — кость. Os, oris — рот. Родительный падеж устраняет неоднозначность.'},
  {id:'l7',pack:'latin',type:'text',prompt:'Напишите по-латыни «мышца» в именительном падеже единственного числа.',answers:['musculus'],explanation:'Musculus, i m — мышца.'},
  {id:'l8',pack:'latin',type:'match',prompt:'Соедините действие и название мышцы.',left:['Сгибает','Разгибает','Приводит','Отводит'],right:['abductor','flexor','adductor','extensor'],answer:[1,3,2,0],explanation:'Flexor сгибает, extensor разгибает, adductor приводит, abductor отводит.'},
  {id:'l9',pack:'latin',type:'multi',prompt:'Выберите все верные переводы.',options:['anterior — передний','brevis — длинный','externus — наружный','dexter — левый'],answer:[0,2],explanation:'Brevis означает короткий; dexter — правый.'},
  {id:'l10',pack:'latin',type:'order',prompt:'Расположите названия от плеча к пальцам: плечевая кость → предплечье → запястье → палец.',items:['carpus','digitus','humerus','antebrachium'],answer:[2,3,0,1],explanation:'Humerus → antebrachium → carpus → digitus. Здесь проверяется перевод подписей, а не перечень костей.'},
  {id:'c1',pack:'cell',type:'single',prompt:'Основа хроматина — это…',options:['ДНК и связанные с ней белки','Только липиды','Только РНК'],answer:0,explanation:'Хроматин объединяет ДНК и белки.'},
  {id:'c2',pack:'cell',type:'match',prompt:'Соедините структуру и её роль.',left:['Ядерная пора','Ядрышко','Гистоны'],right:['Упаковка ДНК','Обмен между ядром и цитоплазмой','Образование рибосомных субъединиц'],answer:[1,2,0],explanation:'Поры обеспечивают транспорт, ядрышко участвует в биогенезе рибосом, гистоны — в упаковке ДНК.'},
  {id:'c3',pack:'cell',type:'text',prompt:'Как называется комплекс ДНК, обёрнутой вокруг гистонового ядра?',answers:['нуклеосома','nucleosome'],explanation:'Это нуклеосома — базовая единица упаковки хроматина.'},
  {id:'c4',pack:'cell',type:'multi',prompt:'Выберите верные признаки ядерной оболочки.',options:['Две мембраны','Есть ядерные поры','Состоит только из белка','Всегда отсутствует у эукариот'],answer:[0,1],explanation:'Оболочка имеет две мембраны, пронизанные порами.'},
  {id:'c5',pack:'cell',type:'single',scenario:'В условной клетке нарушена работа ядерных пор.',prompt:'Какой процесс непосредственно затронут?',options:['Транспорт между ядром и цитоплазмой','Сокращение саркомера','Образование эмали'],answer:0,explanation:'Поры регулируют обмен веществами через ядерную оболочку.'},
  {id:'c6',pack:'cell',type:'text',prompt:'Назовите ядерную структуру, связанную с образованием рибосомных субъединиц.',answers:['ядрышко','nucleolus'],explanation:'Ядрышко участвует в синтезе рРНК и сборке субъединиц.'},
  {id:'c7',pack:'cell',type:'order',prompt:'Восстановите упрощённую последовательность образования и выхода рибосомных субъединиц.',items:['Выход через ядерные поры','Синтез рРНК в ядрышке','Сборка субъединиц с белками'],answer:[1,2,0],explanation:'Сначала синтезируется рРНК, затем собираются субъединицы и экспортируются.'},
  {id:'c8',pack:'cell',type:'single',prompt:'Какие белки образуют основу нуклеосомного ядра?',options:['Гистоны','Коллаген','Гемоглобин'],answer:0,explanation:'ДНК оборачивается вокруг гистонов.'},
  {id:'c9',pack:'cell',type:'multi',prompt:'Что относится к организации ядра?',options:['Хроматин','Ядрышко','Ядерная оболочка','Суставной хрящ'],answer:[0,1,2],explanation:'Первые три структуры относятся к ядру.'},
  {id:'c10',pack:'cell',type:'single',prompt:'Ядерная пора соединяет…',options:['Ядро и цитоплазму','Два соседних нейрона','Две кости'],answer:0,explanation:'Поровые комплексы пересекают ядерную оболочку.'},
  {id:'h1',pack:'histo',type:'order',prompt:'Расположите слои стенки сердца от полости наружу.',items:['Эпикард','Эндокард','Миокард'],answer:[1,2,0],explanation:'Эндокард → миокард → эпикард.'},
  {id:'h2',pack:'histo',type:'hotspot',visual:'wall',prompt:'Найдите миокард на рисунке.',options:['Эндокард','Миокард','Эпикард'],answer:1,explanation:'Миокард — средний мышечный слой (2).'},
  {id:'h3',pack:'histo',type:'text',prompt:'Как называется внутренний слой стенки сердца?',answers:['эндокард','endocardium'],explanation:'Эндокард выстилает камеры сердца.'},
  {id:'h4',pack:'histo',type:'match',prompt:'Соедините компонент крови и основную роль.',left:['Эритроциты','Лейкоциты','Тромбоциты'],right:['Защита организма','Перенос кислорода','Участие в гемостазе'],answer:[1,0,2],explanation:'Эритроциты переносят кислород, лейкоциты защищают, тромбоциты участвуют в остановке кровотечения.'},
  {id:'h5',pack:'histo',type:'multi',prompt:'Выберите форменные элементы крови.',options:['Эритроциты','Плазма','Лейкоциты','Тромбоциты'],answer:[0,2,3],explanation:'Плазма — жидкая межклеточная среда.'},
  {id:'h6',pack:'histo',type:'single',scenario:'На учебном препарате отмечена наружная поверхность стенки сердца.',prompt:'Какой слой подписать?',options:['Эндокард','Эпикард','Миокард'],answer:1,explanation:'Снаружи расположен эпикард.'},
  {id:'h7',pack:'histo',type:'text',prompt:'Назовите жидкую межклеточную среду крови.',answers:['плазма','плазма крови'],explanation:'Форменные элементы находятся в плазме.'},
  {id:'h8',pack:'histo',type:'single',prompt:'Какой компонент крови представляет собой клеточные фрагменты?',options:['Тромбоциты','Эритроциты','Лейкоциты'],answer:0,explanation:'Тромбоциты — фрагменты клеток, участвующие в гемостазе.'},
  {id:'h9',pack:'histo',type:'hotspot',visual:'wall',prompt:'Найдите эндокард на рисунке.',options:['Эндокард','Миокард','Эпикард'],answer:0,explanation:'Внутренний слой, прилежащий к полости, — эндокард (1).'},
  {id:'h10',pack:'histo',type:'single',prompt:'Какой слой обеспечивает сокращение стенки сердца?',options:['Миокард','Эпикард','Эндокард'],answer:0,explanation:'Миокард образован сердечной мышечной тканью.'}
].map(task=>({...task,sources:task.pack==='latin'?['latin']:task.pack==='cell'?['cell','nucleus']:['histo',/^h[4578]$/.test(task.id)?'blood':'heart']}));
