import { 
  StudyMaterial, 
  UserProfile, 
  StudyGroup, 
  NotificationItem, 
  Comment,
  Badge
} from './types';

export const INITIAL_BADGES: Badge[] = [
  {
    id: 'badge-1',
    name: 'Knower Estrella 🌟',
    description: 'Publicó 5 o más materiales de alta calidad valorados con +4.5 estrellas.',
    icon: 'Star',
    category: 'creador',
    unlockedAt: '2026-06-15'
  },
  {
    id: 'badge-2',
    name: 'Racha de Fuego 🔥',
    description: 'Completó 7 días consecutivos estudiando en StudyPrime.',
    icon: 'Flame',
    category: 'estudio',
    unlockedAt: '2026-07-20'
  },
  {
    id: 'badge-3',
    name: 'Maestro de la IA 🤖',
    description: 'Realizó 50 consultas académicas exitosas al tutor de IA.',
    icon: 'Bot',
    category: 'ia',
    unlockedAt: '2026-07-01'
  },
  {
    id: 'badge-4',
    name: 'Líder Comunitario 👥',
    description: 'Superó los 100 seguidores en su perfil de Knower.',
    icon: 'Users',
    category: 'social',
    unlockedAt: '2026-05-10'
  },
  {
    id: 'badge-5',
    name: 'As de los Quizzes 🎯',
    description: 'Obtuvo una puntuación perfecta del 100% en 10 quizzes.',
    icon: 'Trophy',
    category: 'estudio'
  }
];

export const CURRENT_USER: UserProfile = {
  id: 'usr-me',
  name: 'Alejandro Martínez',
  username: '@alex_study26',
  email: 'alex.martinez@estudiante.edu',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  role: 'Knower',
  bio: 'Estudiante de 2º Bachillerato Tecnológico 🚀 Apasionado de la Física, Matemáticas y la Programación. Compartiendo mis apuntes detallados.',
  level: 'Bachillerato',
  mainSubjects: ['Matemáticas', 'Física', 'Informática'],
  followersCount: 142,
  followingCount: 38,
  points: 1250,
  badges: INITIAL_BADGES.slice(0, 4),
  itemsPublished: 8,
  streakDays: 12,
  plan: 'free',
  dailyQueriesLeft: 5
};

export const MOCK_USERS: UserProfile[] = [
  CURRENT_USER,
  {
    id: 'usr-1',
    name: 'Dra. Elena Gómez',
    username: '@elena_bio',
    email: 'elena.gomez@bio.org',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    role: 'Knower',
    bio: 'Profesora universitaria de Biología Celular y Genética. Apuntes universitarios ordenados con esquemas.',
    level: 'Universidad',
    mainSubjects: ['Biología', 'Química'],
    followersCount: 1890,
    followingCount: 12,
    points: 8400,
    badges: INITIAL_BADGES,
    itemsPublished: 34,
    streakDays: 45,
    plan: 'premium',
    dailyQueriesLeft: 999,
    isFollowing: true
  },
  {
    id: 'usr-2',
    name: 'Carlos Ruiz',
    username: '@carloshistory',
    email: 'carlos.ruiz@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    role: 'Knower',
    bio: 'Amante de la Historia Contemporánea e Historia de España. Resúmenes cronológicos con fechas clave.',
    level: 'Bachillerato',
    mainSubjects: ['Historia', 'Filosofía'],
    followersCount: 940,
    followingCount: 89,
    points: 4120,
    badges: [INITIAL_BADGES[0], INITIAL_BADGES[1]],
    itemsPublished: 19,
    streakDays: 21,
    plan: 'free',
    dailyQueriesLeft: 3,
    isFollowing: false
  },
  {
    id: 'usr-3',
    name: 'Sofia Chen',
    username: '@math_genius_sofia',
    email: 'sofia.chen@math.edu',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    role: 'Knower',
    bio: 'Estudiante de Grado en Matemáticas y Física. Resoluciones explicadas paso a paso de Cálculo e Álgebra.',
    level: 'Universidad',
    mainSubjects: ['Matemáticas', 'Física'],
    followersCount: 2310,
    followingCount: 45,
    points: 9800,
    badges: INITIAL_BADGES,
    itemsPublished: 42,
    streakDays: 30,
    plan: 'premium',
    dailyQueriesLeft: 999,
    isFollowing: true
  }
];

export const MOCK_MATERIALS: StudyMaterial[] = [
  {
    id: 'mat-1',
    title: 'Cálculo de Derivadas e Integrales Definidas con Ejemplos Resueltos',
    description: 'Guía práctica completa para Bachillerato y Selectividad/EBAU. Incluye reglas de derivación, integración por partes y cambio de variable con ejercicios explicados paso a paso.',
    authorId: 'usr-me',
    authorName: 'Alejandro Martínez',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    authorRole: 'Knower',
    level: 'Bachillerato',
    subject: 'Matemáticas',
    topic: 'Análisis Matemático y Cálculo',
    region: 'España',
    type: 'guia',
    likesCount: 342,
    commentsCount: 28,
    rating: 4.9,
    views: 2890,
    createdAt: '2026-07-22',
    contentText: `DEFINICIÓN DE DERIVADA EN UN PUNTO:
f'(a) = lim_{h -> 0} [f(a + h) - f(a)] / h

REGLAS DE DERIVACIÓN CLAVE:
1. Regla del producto: (u · v)' = u'v + uv'
2. Regla del cociente: (u / v)' = (u'v - uv') / v²
3. Regla de la cadena: [f(g(x))]' = f'(g(x)) · g'(x)

INTEGRALES INDEFINIDAS MÁS USADAS:
- ∫ x^n dx = (x^{n+1}) / (n+1) + C (para n ≠ -1)
- ∫ (1/x) dx = ln|x| + C
- ∫ e^x dx = e^x + C
- ∫ sin(x) dx = -cos(x) + C
- ∫ cos(x) dx = sin(x) + C

EJEMPLO RESUELTO:
Calcular la derivada de f(x) = (3x² + 5) · e^{2x}
Aplicando regla del producto:
f'(x) = (6x) · e^{2x} + (3x² + 5) · (2e^{2x})
f'(x) = 2e^{2x} · (3x + 3x² + 5) = 2e^{2x}(3x² + 3x + 5)`,
    tags: ['Matemáticas', 'EBAU', 'Cálculo', 'Derivadas', 'Integrales'],
    isLiked: true,
    isSaved: true,
    flashcardSet: [
      {
        id: 'fc-1',
        question: '¿Cuál es la regla del producto para derivar f(x) = u(x) · v(x)?',
        answer: 'f\'(x) = u\'(x)v(x) + u(x)v\'(x)',
        explanation: 'La derivada del primero por el segundo sin derivar, más el primero sin derivar por la derivada del segundo.',
        difficulty: 'fácil'
      },
      {
        id: 'fc-2',
        question: '¿Cuál es la integral de 1/x dx?',
        answer: 'ln|x| + C',
        explanation: 'La función cuya derivada es 1/x es el logaritmo neperiano del valor absoluto de x.',
        difficulty: 'fácil'
      },
      {
        id: 'fc-3',
        question: '¿Cómo se integra por partes?',
        answer: '∫ u dv = u·v - ∫ v du',
        explanation: 'Regla nemotécnica: Un Día Vi Una Vaca Sin Cola Vestida De Uniforme.',
        difficulty: 'medio'
      }
    ],
    quizSet: [
      {
        id: 'qz-1',
        question: '¿Cuál es la derivada de f(x) = e^{3x}?',
        options: ['e^{3x}', '3e^{3x}', '3x e^{3x-1}', 'e^{3}'],
        correctAnswerIndex: 1,
        explanation: 'Por la regla de la cadena: derivada del exponente (3) multiplicada por la propia exponencial (e^{3x}).'
      },
      {
        id: 'qz-2',
        question: '¿Cuánto vale la integral definida ∫_0^1 (2x + 1) dx?',
        options: ['1', '2', '3', '4'],
        correctAnswerIndex: 1,
        explanation: 'La primitiva es F(x) = x² + x. Evaluando en 1: 1² + 1 = 2. Evaluando en 0: 0. Resultado: 2 - 0 = 2.'
      }
    ]
  },
  {
    id: 'mat-2',
    title: 'Resumen de Biología Celular: Mitosis, Meiosis y Sintesis de Proteínas',
    description: 'Esquema visual detallado con las fases del ciclo celular, replicación del ADN, transcripción de ARN y traducción en los ribosomas. Ideal para Selectividad y Universidad.',
    authorId: 'usr-1',
    authorName: 'Dra. Elena Gómez',
    authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    authorRole: 'Knower',
    level: 'Universidad',
    subject: 'Biología',
    topic: 'Biología Celular y Molecular',
    region: 'España',
    type: 'resumen',
    likesCount: 820,
    commentsCount: 64,
    rating: 5.0,
    views: 6400,
    createdAt: '2026-07-18',
    contentText: `1. CICLO CELULAR Y MITOSIS:
- Interfase: Fases G1 (crecimiento), S (replicación ADN), G2 (preparación).
- Mitosis (Células somáticas, 2n -> 2n):
  1. Profase: Condensación cromosómica, desaparición del nucléolo y envoltura nuclear.
  2. Metafase: Cromosomas en la placa ecuatorial.
  3. Anafase: Separación de cromátidas hermanas hacia los polos.
  4. Telofase y Citocinesis: Reconstrucción nuclear y división del citoplasma.

2. MEIOSIS (Células germinales, 2n -> 4n haploides):
- Meiosis I (Reduccional): Sobrecruzamiento (crossing-over) en Profase I (Paquiteno) para variabilidad genética.
- Meiosis II (Ecuacional): Similar a la mitosis pero con dotación haploide (n).

3. EXPRESIÓN GÉICA:
- Transcripción: ADN -> ARNm (ARN polimerasa II en el núcleo).
- Traducción: ARNm -> Proteína en el ribosoma con la ayuda de ARNt y codones. Codón de inicio: AUG (Metionina).`,
    tags: ['Biología', 'Célula', 'ADN', 'Mitosis', 'Meiosis', 'Genética'],
    isLiked: false,
    isSaved: true,
    flashcardSet: [
      {
        id: 'fc-20',
        question: '¿En qué fase de la meiosis ocurre el sobrecruzamiento o crossing-over?',
        answer: 'En la Profase I (específicamente en la subfase de Paquiteno).',
        explanation: 'Es el proceso clave que genera recombinación genética y biodiversidad.',
        difficulty: 'medio'
      },
      {
        id: 'fc-21',
        question: '¿Cuál es el codón de inicio universal de la traducción proteica?',
        answer: 'AUG (codifica para el aminoácido Metionina).',
        explanation: 'Indica al ribosoma dónde comenzar la síntesis de la cadena polipeptídica.',
        difficulty: 'fácil'
      }
    ],
    quizSet: [
      {
        id: 'qz-20',
        question: '¿Cuál es la principal diferencia entre mitosis y meiosis respecto a las células hijas?',
        options: [
          'La mitosis genera 4 células haploides y la meiosis 2 diploides',
          'La mitosis genera 2 células diploides idénticas y la meiosis 4 haploides con variabilidad',
          'Ambas producen células idénticas',
          'La mitosis sólo ocurre en plantas'
        ],
        correctAnswerIndex: 1,
        explanation: 'La mitosis preserva el número cromosómico (2n) para crecimiento corporal; la meiosis reduce el número a la mitad (n) para formar gametos.'
      }
    ]
  },
  {
    id: 'mat-3',
    title: 'Leyes de Newton, Cinemática y Dinámica de Sistemas',
    description: 'Fórmulas, esquemas de fuerzas (diagramas de cuerpo libre) y ejercicios resueltos de planos inclinados, poleas y fricción.',
    authorId: 'usr-3',
    authorName: 'Sofia Chen',
    authorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    authorRole: 'Knower',
    level: 'Bachillerato',
    subject: 'Física',
    topic: 'Mecánica Clásica',
    region: 'Internacional',
    type: 'apunte',
    likesCount: 512,
    commentsCount: 31,
    rating: 4.8,
    views: 4100,
    createdAt: '2026-07-20',
    contentText: `LEYES DE NEWTON:
1ª Ley (Inercia): Σ F = 0 => v = constante (o reposo).
2ª Ley (Fundamental): Σ F = m · a
3ª Ley (Acción y Reacción): F_{A->B} = - F_{B->A}

DIAGRAMAS DE CUERPO LIBRE EN PLANO INCLINADO (Ángulo θ):
- Peso: P = m · g
- Componente paralela al plano: Px = m · g · sin(θ)
- Componente perpendicular: Py = m · g · cos(θ)
- Fuerza Normal: N = Py = m · g · cos(θ)
- Fuerza de Rozamiento: Fr = μ · N = μ · m · g · cos(θ)

Ecuación del movimiento descendente con rozamiento:
m · g · sin(θ) - μ · m · g · cos(θ) = m · a
Aceleración: a = g · (sin(θ) - μ · cos(θ))`,
    tags: ['Física', 'Newton', 'Cinemática', 'Fuerzas', 'Plano Inclinado'],
    isLiked: false,
    isSaved: false
  },
  {
    id: 'mat-4',
    title: 'Historia Contemporánea de España: La Transición Democrática (1975-1982)',
    description: 'Cronología esquemática completa desde la muerte de Franco, la Ley para la Reforma Política, los Pactos de la Moncloa, la Constitución de 1978 hasta las elecciones de 1982.',
    authorId: 'usr-2',
    authorName: 'Carlos Ruiz',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    authorRole: 'Knower',
    level: 'Bachillerato',
    subject: 'Historia',
    topic: 'Historia de España S.XX',
    region: 'España',
    type: 'resumen',
    likesCount: 410,
    commentsCount: 19,
    rating: 4.7,
    views: 3200,
    createdAt: '2026-07-15',
    contentText: `CRONOLOGÍA CLAVE DE LA TRANSICIÓN ESPAÑOLA:
- 20 nov 1975: Muerte del dictador Francisco Franco. D. Juan Carlos I jurado Rey de España.
- Julio 1976: Adolfo Suárez nombrado Presidente del Gobierno.
- Noviembre 1976: Aprobación de la Ley para la Reforma Política por las Cortes Franquistas.
- Abril 1977: Legalización del Partido Comunista de España (PCE).
- 15 Junio 1977: Primeras elecciones democráticas desde 1936. Victoria de la UCD.
- Octubre 1977: Pactos de la Moncloa (acuerdos económicos y de estabilidad social).
- 6 Diciembre 1978: Aprobación en referéndum de la Constitución Española.
- 23 Febrero 1981: Intento fallido de golpe de Estado (23-F) de Tejero.
- Octubre 1982: Victoria histórica del PSOE de Felipe González. Fin del proceso de transición.`,
    tags: ['Historia', 'España', 'EBAU', 'Transición', 'Constitución'],
    isLiked: false,
    isSaved: false
  }
];

export const MOCK_GROUPS: StudyGroup[] = [
  {
    id: 'grp-1',
    name: 'Preparación EBAU / Selectividad 2026 🎯',
    description: 'Grupo colaborativo de estudio diario para resolver dudas de Matemáticas, Física, Química y Lengua para el examen de admisión.',
    subject: 'Matemáticas',
    level: 'Bachillerato',
    membersCount: 418,
    isPrivate: false,
    createdBy: 'Alejandro Martínez',
    groupAvatar: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=150&auto=format&fit=crop&q=80',
    tags: ['EBAU', 'Bachillerato', 'Exámenes', 'Dudas'],
    isJoined: true,
    members: [
      { name: 'Alejandro Martínez', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', role: 'Creador' },
      { name: 'Sofia Chen', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80', role: 'Moderador' },
      { name: 'Carlos Ruiz', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', role: 'Miembro' }
    ],
    recentMessages: [
      {
        id: 'msg-1',
        groupId: 'grp-1',
        senderId: 'usr-3',
        senderName: 'Sofia Chen',
        senderAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
        text: '¡Hola a todos! Acabo de subir a la biblioteca unos apuntes interactivos de derivadas con el Tutor de IA. Échenle un vistazo 📚✨',
        timestamp: '10:15 AM'
      },
      {
        id: 'msg-2',
        groupId: 'grp-1',
        senderId: 'usr-me',
        senderName: 'Alejandro Martínez',
        senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        text: '¡Genial Sofia! Justo estaba practicando la integración por partes. ¿Alguien tiene ejercicios tipo examen del año pasado?',
        timestamp: '10:22 AM'
      }
    ]
  },
  {
    id: 'grp-2',
    name: 'Club de Biología y Ciencias Médicas 🔬',
    description: 'Comunidad universitaria para compartir resúmenes de Histología, Fisiología y Bioquímica.',
    subject: 'Biología',
    level: 'Universidad',
    membersCount: 295,
    isPrivate: false,
    createdBy: 'Dra. Elena Gómez',
    groupAvatar: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=150&auto=format&fit=crop&q=80',
    tags: ['Medicina', 'Biología', 'Universidad', 'Anatomía'],
    isJoined: false,
    members: [
      { name: 'Dra. Elena Gómez', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80', role: 'Creadora' }
    ],
    recentMessages: []
  }
];

export const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    type: 'like',
    title: '¡A alguien le gustaron tus apuntes!',
    message: 'Sofia Chen guardó tu guía "Cálculo de Derivadas e Integrales".',
    read: false,
    date: 'Hace 15 minutos'
  },
  {
    id: 'notif-2',
    type: 'follower',
    title: 'Nuevo seguidor en StudyPrime',
    message: 'Carlos Ruiz ha comenzado a seguir tus publicaciones de Bachillerato.',
    read: false,
    date: 'Hace 2 horas'
  },
  {
    id: 'notif-3',
    type: 'badge',
    title: '🏆 ¡Insignia Desbloqueada!',
    message: 'Has ganado la insignia "Racha de Fuego 🔥" por mantener 12 días seguidos estudiando.',
    read: true,
    date: 'Ayer'
  }
];

export const MOCK_COMMENTS: Comment[] = [
  {
    id: 'c-1',
    materialId: 'mat-1',
    authorName: 'Sofia Chen',
    authorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    rating: 5,
    text: '¡Excelente apunte! La explicación de la regla de la cadena aclara todas mis dudas para el examen del viernes.',
    date: 'Hace 1 día'
  },
  {
    id: 'c-2',
    materialId: 'mat-1',
    authorName: 'Carlos Ruiz',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    rating: 5,
    text: 'Súper bien formateado. Lo guardé en mi colección de favoritas. ¡Muchas gracias Alejandro!',
    date: 'Hace 2 días'
  }
];
