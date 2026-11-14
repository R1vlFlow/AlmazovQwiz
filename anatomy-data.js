// Plate coordinates were checked against the original authors' labelled SVGs.
// Keep stable structure IDs: they are part of the user's learning history.
const AN_PLATES=[
 {id:'skull',visual:'an-skull',title:'Кости черепа',subtitle:'Вид спереди · кости лицевого и мозгового черепа',image:'assets/anatomy/skull.svg',source:'https://commons.wikimedia.org/wiki/File:Human_skull_front_bones_numbered.svg',author:'Mariana Ruiz Villarreal / LadyofHats',license:'Public domain',licenseUrl:'https://commons.wikimedia.org/wiki/Commons:Public_domain',orientation:'Вид спереди. Правая сторона человека находится слева на рисунке.',changes:'Удалены номера и выносные линии, обрезано пустое поле. Анатомические контуры сохранены.',regions:[
  ['frontal','Лобная кость','Os frontale',53,16.4,'Образует область лба. В оригинальной легенде — № 1.'],
  ['nasal','Носовая кость','Os nasale',51.5,44.8,'Парная кость спинки носа. В оригинальной легенде — № 2.'],
  ['sphenoid','Клиновидная кость','Os sphenoidale',31.8,45.3,'На этой проекции показан участок в стенке глазницы. В оригинальной легенде — № 5.'],
  ['zygomatic','Скуловая кость','Os zygomaticum',15.1,55.6,'Формирует выступ щеки и часть стенки глазницы. В оригинальной легенде — № 7.'],
  ['maxilla','Верхняя челюсть','Maxilla',37.7,69.4,'Парная кость верхней челюсти. В оригинальной легенде — № 9.'],
  ['mandible','Нижняя челюсть','Mandibula',47.4,93.2,'Непарная кость нижней челюсти. В оригинальной легенде — № 10.']
 ]},
 {id:'arm',visual:'an-arm',title:'Кости верхней конечности',subtitle:'Плечевой пояс, плечо, предплечье и кисть',image:'assets/anatomy/arm.svg',source:'https://commons.wikimedia.org/wiki/File:Human_arm_bones_diagram.svg',author:'Mariana Ruiz Villarreal / LadyofHats; правки участников Wikimedia Commons',license:'Public domain',licenseUrl:'https://commons.wikimedia.org/wiki/Commons:Public_domain',orientation:'Показаны обе конечности; положение предплечий различается. Метки относятся к конечности слева на рисунке.',changes:'Удалены текстовые подписи и выносные линии. Добавлены русская легенда и интерактивные метки.',regions:[
  ['clavicle','Ключица','Clavicula',29.66,7.96,'Вместе с лопаткой относится к плечевому поясу.'],
  ['scapula','Лопатка','Scapula',27.43,11.69,'Плоская кость плечевого пояса.'],
  ['humerus','Плечевая кость','Humerus',21.83,28.29,'Кость плеча, между плечевым и локтевым суставами.'],
  ['radius','Лучевая кость','Radius',17.93,56.18,'Одна из двух костей предплечья. При пронации меняет положение относительно локтевой кости.'],
  ['ulna','Локтевая кость','Ulna',15.98,61.49,'Одна из двух костей предплечья.'],
  ['carpus','Кости запястья','Ossa carpi',13.51,76.76,'Группа коротких костей у основания кисти.'],
  ['metacarpus','Пястные кости','Ossa metacarpi',16.9,82.07,'Расположены между запястьем и фалангами.'],
  ['phalanges','Фаланги пальцев кисти','Phalanges digitorum manus',17.64,87.38,'Костная основа пальцев кисти.']
 ],callouts:[[6,6],[6,17],[6,30],[6,46],[6,58],[6,72],[6,84],[6,96]]},
 {id:'heart',visual:'an-heart',title:'Анатомия сердца',subtitle:'Вскрытые камеры и крупные сосуды',image:'assets/anatomy/heart.svg',source:'https://commons.wikimedia.org/wiki/File:Heart_diagram-en.svg',author:'ZooFari',license:'CC BY-SA 3.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/3.0/',orientation:'Правая половина сердца показана слева. Цвета условные: синий и красный обозначают пути крови с разным насыщением кислородом.',changes:'Удалены английские подписи и линии, изменено кадрирование. Производная иллюстрация и её интерактивная разметка доступны по CC BY-SA 3.0.',regions:[
  ['right-atrium','Правое предсердие','Atrium dextrum',23.3,47.9,'Принимает кровь, поступающую по полым венам.'],
  ['right-ventricle','Правый желудочек','Ventriculus dexter',44.8,68.1,'Из него кровь направляется в лёгочный ствол.'],
  ['left-atrium','Левое предсердие','Atrium sinistrum',71.9,42.5,'Принимает кровь по лёгочным венам.'],
  ['left-ventricle','Левый желудочек','Ventriculus sinister',75.6,65.1,'Из него кровь поступает в аорту.'],
  ['aorta','Аорта','Aorta',41.9,25.3,'Начало большого круга кровообращения.'],
  ['superior-cava','Верхняя полая вена','Vena cava superior',19.6,30.4,'Впадает в правое предсердие.'],
  ['pulmonary-trunk','Лёгочный ствол','Truncus pulmonalis',56.7,34.7,'Выходит из правого желудочка и делится на лёгочные артерии.'],
  ['septum','Межжелудочковая перегородка','Septum interventriculare',61.5,67.4,'Разделяет правый и левый желудочки.']
 ]}
];
for(const p of AN_PLATES){
 MQ_SOURCES['plate-'+p.id]={title:p.title+' · '+p.author,url:p.source,locator:'Авторская иллюстрация и легенда. '+p.license};
 MQ_VISUALS[p.visual]={title:p.title,caption:p.orientation,labels:p.regions.map(r=>r[1]),points:p.regions.map(r=>[r[3],r[4]]),image:p.image,plate:p.id};
 MQ_PACKS.unshift({id:'anatomy-'+p.id,number:'A',title:p.title,subject:'Анатомия',symbol:'◎',color:'anatomy',description:p.regions.length+' структур: найти на схеме и назвать по памяти.',minutes:Math.ceil(p.regions.length*1.5),plate:p.id});
 for(const [index,r] of p.regions.entries()){
  const base={pack:'anatomy-'+p.id,visual:p.visual,explanation:r[1]+' · '+r[2]+'. '+r[5],sources:['plate-'+p.id],options:p.regions.map(x=>x[1])};
  MQ_TASKS.push({...base,id:'an-'+p.id+'-'+r[0],type:'hotspot',prompt:'Найдите: '+r[1].toLocaleLowerCase('ru')+'.',answer:index});
  MQ_TASKS.push({...base,id:'an-'+p.id+'-'+r[0]+'-name',type:'text',prompt:'Назовите отмеченную структуру на русском или латыни.',marker:index,answers:[r[1],r[2]],options:undefined});
 }
}
