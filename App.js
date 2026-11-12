import React, { useState, useRef } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  StatusBar,
  Alert,
  Platform,
  Animated,
  Easing,
} from "react-native";

const RED = "#B91C1C";
const RED_DARK = "#941B1B";
const CREAM = "#F5EDE3";
const WHITE = "#FFFFFF";
const MUTED = "#8F6D60";
const BORDER = "#EBD4C3";
const GREEN = "#16834A";

const PIZZAS = [
  {
    id: 1,
    name: "Margherita Clássica",
    price: 49.9,
    category: "Mais Pedidas",
    rating: "4.8",
    time: "35–50 min",
    description:
      "Molho de tomate artesanal, mozzarella de búfala, manjericão fresco e azeite extra virgem.",
    image:
      "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=900",
  },
  {
    id: 2,
    name: "Calabresa Especial",
    price: 54.9,
    category: "Salgadas",
    rating: "4.7",
    time: "35–50 min",
    description: "Calabresa fatiada, cebola, mozzarella e orégano.",
    image:
      "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=900",
  },
  {
    id: 3,
    name: "Quatro Queijos",
    price: 59.9,
    category: "Salgadas",
    rating: "4.9",
    time: "35–50 min",
    description: "Mozzarella, provolone, parmesão e catupiry.",
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=900",
  },
  {
    id: 4,
    name: "Pepperoni",
    price: 57.9,
    category: "Salgadas",
    rating: "4.8",
    time: "35–50 min",
    description: "Molho artesanal, mozzarella e pepperoni.",
    image:
      "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=900",
  },
  {
    id: 5,
    name: "Chocolate com Morango",
    price: 45.9,
    category: "Doces",
    rating: "4.6",
    time: "30–45 min",
    description: "Chocolate cremoso e morangos frescos.",
    image:
      "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=900",
  },
];

const EXTRAS = [
  ["Pepperoni extra", 5.9],
  ["Catupiry", 4.5],
  ["Bacon", 5.5],
  ["Champignon", 4.9],
  ["Tomate seco", 3.9],
  ["Rúcula", 3.5],
  ["Palmito", 4.5],
  ["Ovo", 2.9],
  ["Pimentão", 2.5],
];

const VALID_COUPONS = {
  VENEZA10: { type: "percent", value: 10, label: "10% OFF" },
  VENEZA15: { type: "percent", value: 15, label: "15% OFF" },
  VENEZA5: { type: "percent", value: 5, label: "5% OFF" },
  FRETEGRATIS: { type: "freeShipping", value: 0, label: "Frete Grátis" },
};

const QUIZ = [
  {
    q: "Qual ingrediente é tradicional na Margherita?",
    options: ["Manjericão", "Abacaxi", "Batata"],
    correct: 0,
  },
  {
    q: "De onde vem o nome 'pizza Margherita'?",
    options: ["Rainha Margherita", "Um chef italiano", "Uma cidade"],
    correct: 0,
  },
  {
    q: "Qual queijo NÃO vai na Quatro Queijos?",
    options: ["Cheddar", "Provolone", "Parmesão"],
    correct: 0,
  },
];

const money = (value) =>
  Number(value || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

export default function App() {
  const [page, setPage] = useState("welcome");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todas");

  const [selectedPizza, setSelectedPizza] = useState(PIZZAS[0]);
  const [quantity, setQuantity] = useState(1);
  const [extras, setExtras] = useState([]);
  const [notes, setNotes] = useState("");

  const [cart, setCart] = useState([]);
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [activeCoupon, setActiveCoupon] = useState(null);

  const [orders, setOrders] = useState([]);
  const [address, setAddress] = useState(
    "Rua das Palmeiras, 42 - Jardim Europa"
  );

  const [delivery, setDelivery] = useState("Entrega em casa");
  const [payment, setPayment] = useState("PIX");
  const [changeFor, setChangeFor] = useState("");

  const [order, setOrder] = useState(null);
  const [favorites, setFavorites] = useState([]);

  // ---------- ESTADOS DOS JOGOS ----------
  const [activeGame, setActiveGame] = useState(null); // "roda" | "memoria" | "quiz"
  const [gameResult, setGameResult] = useState(null);

  const [spinning, setSpinning] = useState(false);
  const [wheelResult, setWheelResult] = useState(null);
  const spinValue = useRef(new Animated.Value(0)).current;

  const [memoryCards, setMemoryCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);

  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);

  // ---------- CÁLCULOS ----------
  const subtotal = cart.reduce(
    (sum, item) => sum + item.total * item.quantity,
    0
  );

  const isFreeShipping =
    couponApplied && activeCoupon?.type === "freeShipping";

  const discount =
    couponApplied && activeCoupon?.type === "percent"
      ? subtotal * (activeCoupon.value / 100)
      : 0;

  const deliveryFee =
    delivery === "Entrega em casa" && !isFreeShipping ? 6.9 : 0;

  const total = Math.max(0, subtotal + deliveryFee - discount);

  const cartCount = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const go = (nextPage) => setPage(nextPage);

  const back = () => {
    const destinations = {
      login: "welcome",
      register: "welcome",
      pizza: "menu",
      cart: "home",
      orders: "home",
      games: "home",
      profile: "home",
      addresses: "customer",
      favorites: "profile",
      coupons: "profile",
      support: "profile",
      customer: "cart",
      fulfillment: "customer",
      payment: "fulfillment",
      review: "payment",
      confirmation: "home",
      tracking: "orders",
      menu: "home",
    };
    setPage(destinations[page] || "home");
  };

  // ---------- CARRINHO ----------
  const addToCart = () => {
    const extraCost = extras.reduce((s, i) => s + i.price, 0);
    const item = {
      key: `${selectedPizza.id}-${Date.now()}`,
      pizza: selectedPizza,
      name: selectedPizza.name,
      quantity,
      extras: [...extras],
      notes,
      total: selectedPizza.price + extraCost,
      image: selectedPizza.image,
    };
    setCart((old) => [...old, item]);
    setExtras([]);
    setNotes("");
    setQuantity(1);
    setPage("cart");
  };

  const changeCartQty = (key, delta) => {
    setCart((old) =>
      old
        .map((item) =>
          item.key === key
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (key) => {
    setCart((old) => old.filter((item) => item.key !== key));
  };

  const applyCoupon = (code) => {
    const codeToUse = (code ?? coupon).trim().toUpperCase();
    const found = VALID_COUPONS[codeToUse];

    if (found) {
      setCoupon(codeToUse);
      setCouponApplied(true);
      setActiveCoupon(found);
      Alert.alert("Cupom aplicado", `${found.label} aplicado com sucesso!`);
    } else {
      setCouponApplied(false);
      setActiveCoupon(null);
      Alert.alert(
        "Cupom não encontrado",
        "Experimente VENEZA5, VENEZA10, VENEZA15 ou FRETEGRATIS."
      );
    }
  };

  const confirmOrder = () => {
    if (!cart.length) {
      Alert.alert("Carrinho vazio", "Adicione uma pizza antes de confirmar.");
      return;
    }
    if (delivery === "Entrega em casa" && !address.trim()) {
      Alert.alert("Endereço obrigatório", "Informe o endereço de entrega.");
      setPage("customer");
      return;
    }

    const newOrder = {
      id: `VSM-${Math.floor(1000 + Math.random() * 9000)}`,
      items: cart.map((i) => `${i.quantity}x ${i.name}`).join(", "),
      total,
      address:
        delivery === "Entrega em casa" ? address : "Retirada na loja",
      payment,
      status: "Pedido recebido",
      createdAt: new Date().toLocaleString("pt-BR"),
    };

    setOrder(newOrder);
    setOrders((old) => [newOrder, ...old]);
    setCart([]);
    setCouponApplied(false);
    setActiveCoupon(null);
    setCoupon("");
    setPage("confirmation");
  };

  // ---------- JOGOS ----------
  const awardPrize = (prizeLabel, couponCode) => {
    setGameResult({ prize: prizeLabel, coupon: couponCode });
    setCoupon(couponCode);
    setCouponApplied(true);
    setActiveCoupon(VALID_COUPONS[couponCode] || null);
    Alert.alert(
      "🏆 Você ganhou!",
      `${prizeLabel}\nCupom ${couponCode} já foi aplicado no seu carrinho.`
    );
  };

  const spinWheel = () => {
    if (spinning) return;
    setSpinning(true);
    setWheelResult(null);
    spinValue.setValue(0);

    const prizes = [
      { label: "10% OFF", coupon: "VENEZA10" },
      { label: "Frete Grátis", coupon: "FRETEGRATIS" },
      { label: "15% OFF", coupon: "VENEZA15" },
      { label: "Tente novamente", coupon: null },
      { label: "5% OFF", coupon: "VENEZA5" },
      { label: "Brinde na próxima", coupon: null },
    ];

    const pick = prizes[Math.floor(Math.random() * prizes.length)];

    Animated.timing(spinValue, {
      toValue: 1,
      duration: 2000,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      setWheelResult(pick);
      setSpinning(false);
      if (pick.coupon) {
        awardPrize(pick.label, pick.coupon);
      } else {
        Alert.alert("Roda da Fortuna", `Resultado: ${pick.label}`);
      }
    });
  };

  const startMemory = () => {
    const icons = ["🍕", "🍕", "🧀", "🧀", "🍅", "🍅", "🍷", "🍷"];
    const shuffled = [...icons].sort(() => Math.random() - 0.5);
    setMemoryCards(shuffled);
    setFlipped([]);
    setMatched([]);
    setGameResult(null);
  };

  const flipCard = (index) => {
    if (flipped.includes(index) || matched.includes(index)) return;
    if (flipped.length === 2) return;

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      const [a, b] = newFlipped;
      if (memoryCards[a] === memoryCards[b]) {
        const newMatched = [...matched, a, b];
        setMatched(newMatched);
        setFlipped([]);
        if (newMatched.length === memoryCards.length) {
          setTimeout(
            () => awardPrize("Frete Grátis", "FRETEGRATIS"),
            400
          );
        }
      } else {
        setTimeout(() => setFlipped([]), 900);
      }
    }
  };

  const answerQuiz = (optionIndex) => {
    const isCorrect = optionIndex === QUIZ[quizIndex].correct;
    const newScore = quizScore + (isCorrect ? 1 : 0);
    setQuizScore(newScore);

    if (quizIndex + 1 < QUIZ.length) {
      setQuizIndex(quizIndex + 1);
    } else {
      const prize =
        newScore === QUIZ.length
          ? { label: "15% OFF", coupon: "VENEZA15" }
          : newScore >= 2
          ? { label: "10% OFF", coupon: "VENEZA10" }
          : null;

      if (prize) {
        awardPrize(prize.label, prize.coupon);
      } else {
        Alert.alert(
          "Quiz finalizado",
          `Você acertou ${newScore}/${QUIZ.length}. Tente novamente!`
        );
      }
      setQuizIndex(0);
      setQuizScore(0);
    }
  };

  // ---------- COMPONENTES UTILITÁRIOS ----------
  const btn = (labelTxt, onPress, outline = false, style = {}) => (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={[
        {
          backgroundColor: outline ? "transparent" : RED,
          borderWidth: outline ? 1 : 0,
          borderColor: RED,
          borderRadius: 28,
          paddingVertical: 14,
          paddingHorizontal: 16,
          alignItems: "center",
          justifyContent: "center",
          marginVertical: 5,
        },
        style,
      ]}
    >
      <Text
        style={{
          color: outline ? RED : WHITE,
          fontWeight: "700",
          fontSize: 14,
        }}
      >
        {labelTxt}
      </Text>
    </TouchableOpacity>
  );

  const card = (children, style = {}) => (
    <View
      style={[
        {
          backgroundColor: WHITE,
          borderRadius: 18,
          padding: 14,
          marginVertical: 6,
        },
        style,
      ]}
    >
      {children}
    </View>
  );

  const heading = (title, subtitle) => (
    <View
      style={{
        backgroundColor: RED,
        paddingHorizontal: 18,
        paddingTop: 16,
        paddingBottom: 20,
        borderBottomLeftRadius: 22,
        borderBottomRightRadius: 22,
      }}
    >
      <Text
        style={{
          color: WHITE,
          fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
          fontSize: 25,
          fontWeight: "bold",
        }}
      >
        {title}
      </Text>
      {!!subtitle && (
        <Text style={{ color: "#F9DECE", marginTop: 4 }}>{subtitle}</Text>
      )}
    </View>
  );

  const label = (text) => (
    <Text
      style={{
        color: "#573C30",
        fontWeight: "700",
        marginTop: 8,
        marginBottom: 5,
      }}
    >
      {text}
    </Text>
  );

  const field = (placeholder, value, onChangeText, extra = {}) => {
    const { style: extraStyle, ...inputProps } = extra;
    return (
      <TextInput
        placeholder={placeholder}
        placeholderTextColor="#A58B7D"
        value={value}
        onChangeText={onChangeText}
        {...inputProps}
        style={[
          {
            backgroundColor: WHITE,
            borderWidth: 1,
            borderColor: BORDER,
            borderRadius: 12,
            paddingHorizontal: 14,
            paddingVertical: 12,
            color: "#2A211D",
            marginBottom: 5,
          },
          extraStyle,
        ]}
      />
    );
  };

  const pizzaCard = (pizza) => (
    <TouchableOpacity
      key={pizza.id}
      onPress={() => {
        setSelectedPizza(pizza);
        setQuantity(1);
        setExtras([]);
        setNotes("");
        go("pizza");
      }}
      style={{
        backgroundColor: WHITE,
        borderRadius: 18,
        padding: 10,
        marginBottom: 10,
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <Image
        source={{ uri: pizza.image }}
        style={{
          width: 76,
          height: 76,
          borderRadius: 14,
          backgroundColor: CREAM,
        }}
      />
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={{ color: "#241A16", fontWeight: "800", fontSize: 15 }}>
          {pizza.name}
        </Text>
        <Text
          numberOfLines={2}
          style={{ color: MUTED, fontSize: 12, marginVertical: 4 }}
        >
          {pizza.description}
        </Text>
        <Text style={{ color: RED, fontWeight: "800" }}>
          {money(pizza.price)}
        </Text>
      </View>
      <Text style={{ color: RED, fontSize: 22, paddingHorizontal: 4 }}>›</Text>
    </TouchableOpacity>
  );

  const nav = () => (
    <View
      style={{
        flexDirection: "row",
        backgroundColor: WHITE,
        borderTopWidth: 1,
        borderTopColor: "#F0E3D9",
        paddingVertical: 7,
        justifyContent: "space-around",
      }}
    >
      {[
        ["⌂", "Início", "home"],
        ["▤", "Pedidos", "orders"],
        ["🛒", "Carrinho", "cart"],
        ["♧", "Jogos", "games"],
        ["♙", "Perfil", "profile"],
      ].map(([icon, text, target]) => (
        <TouchableOpacity
          key={target}
          onPress={() => {
            setPage(target);
            if (target === "games") {
              setActiveGame(null);
              setGameResult(null);
            }
          }}
          style={{ alignItems: "center", minWidth: 52 }}
        >
          <Text
            style={{
              fontSize: target === "cart" ? 20 : 22,
              color: page === target ? RED : MUTED,
            }}
          >
            {icon}
            {target === "cart" && cartCount ? ` ${cartCount}` : ""}
          </Text>
          <Text
            style={{
              fontSize: 10,
              color: page === target ? RED : MUTED,
            }}
          >
            {text}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const shell = (content, withNav = false) => (
    <SafeAreaView style={{ flex: 1, backgroundColor: CREAM }}>
      <StatusBar barStyle="light-content" backgroundColor={RED} />
      <View style={{ flex: 1 }}>{content}</View>
      {withNav && nav()}
    </SafeAreaView>
  );

  const scroll = (children) => (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ padding: 14, paddingBottom: 24 }}
    >
      {children}
    </ScrollView>
  );

  const backHeader = (title, subtitle) => (
    <View
      style={{
        backgroundColor: RED,
        padding: 16,
        paddingTop: 10,
        borderBottomLeftRadius: 22,
        borderBottomRightRadius: 22,
      }}
    >
      <TouchableOpacity onPress={back} style={{ marginBottom: 12 }}>
        <Text style={{ color: WHITE, fontSize: 16 }}>‹  Voltar</Text>
      </TouchableOpacity>
      <Text
        style={{
          color: WHITE,
          fontSize: 25,
          fontWeight: "bold",
          fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
        }}
      >
        {title}
      </Text>
      {!!subtitle && (
        <Text style={{ color: "#F9DECE", marginTop: 4 }}>{subtitle}</Text>
      )}
    </View>
  );

  // ---------- TELA INICIAL ----------
  if (page === "welcome") {
    return shell(
      <View
        style={{
          flex: 1,
          justifyContent: "flex-end",
          padding: 22,
          backgroundColor: CREAM,
        }}
      >
        <Image
          source={{ uri: PIZZAS[0].image }}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "55%",
          }}
          resizeMode="cover"
        />
        <View
          style={{
            position: "absolute",
            top: "35%",
            left: 0,
            right: 0,
            height: "20%",
            backgroundColor: CREAM,
            opacity: 0.65,
          }}
        />
        <View style={{ alignItems: "center", marginBottom: 22 }}>
          <Text
            style={{
              color: RED,
              fontSize: 52,
              fontStyle: "italic",
              fontFamily: "Georgia",
            }}
          >
            Veneza
          </Text>
          <Text
            style={{
              color: RED_DARK,
              fontSize: 19,
              fontWeight: "bold",
              letterSpacing: 4,
            }}
          >
            SANTA MASSA
          </Text>
          <Text style={{ color: MUTED, marginTop: 10 }}>
            Pizzaria Artesanal · Est. 1998
          </Text>
        </View>
        {btn("Entrar na conta", () => setPage("login"))}
        {btn("Criar conta", () => setPage("register"), true)}
        <View style={{ height: 65 }} />
      </View>
    );
  }

  // ---------- LOGIN ----------
  if (page === "login") {
    return shell(
      scroll(
        <>
          {backHeader("Bem-vindo", "Entre na sua conta para pedir")}
          {label("E-mail")}
          {field("seu@email.com", email, setEmail, {
            keyboardType: "email-address",
            autoCapitalize: "none",
            autoCorrect: false,
          })}
          {label("Senha")}
          {field("Digite sua senha", password, setPassword, {
            secureTextEntry: true,
            autoCapitalize: "none",
            autoCorrect: false,
            textContentType: "password",
            returnKeyType: "done",
          })}
          <TouchableOpacity
            onPress={() =>
              Alert.alert(
                "Recuperação de senha",
                "A recuperação precisa ser conectada ao backend."
              )
            }
            style={{ alignItems: "flex-end", padding: 8 }}
          >
            <Text style={{ color: RED }}>Esqueci minha senha</Text>
          </TouchableOpacity>
          {btn("Entrar", () => {
            if (!email.trim() || !email.includes("@")) {
              Alert.alert("E-mail inválido", "Digite um e-mail válido.");
              return;
            }
            if (!password.trim()) {
              Alert.alert("Senha obrigatória", "Digite sua senha.");
              return;
            }
            setName(email.split("@")[0] || "Cliente");
            setPage("home");
          })}
          {btn("Criar conta", () => setPage("register"), true)}
        </>
      )
    );
  }

  // ---------- CADASTRO ----------
  if (page === "register") {
    return shell(
      scroll(
        <>
          {backHeader("Criar Conta", "Cadastre-se e faça seus pedidos")}
          {label("Nome completo")}
          {field("Seu nome", name, setName)}
          {label("E-mail")}
          {field("seu@email.com", email, setEmail, {
            keyboardType: "email-address",
            autoCapitalize: "none",
            autoCorrect: false,
          })}
          {label("Telefone / WhatsApp")}
          {field("(11) 99999-9999", phone, setPhone, {
            keyboardType: "phone-pad",
          })}
          {label("Senha")}
          {field(
            "Crie uma senha (mínimo 6 caracteres)",
            registerPassword,
            setRegisterPassword,
            {
              secureTextEntry: true,
              autoCapitalize: "none",
              autoCorrect: false,
              textContentType: "newPassword",
              returnKeyType: "done",
            }
          )}
          {btn("Criar conta", () => {
            if (!name.trim()) {
              Alert.alert("Nome obrigatório", "Digite seu nome completo.");
              return;
            }
            if (!email.trim() || !email.includes("@")) {
              Alert.alert("E-mail inválido", "Digite um e-mail válido.");
              return;
            }
            if (registerPassword.length < 6) {
              Alert.alert(
                "Senha muito curta",
                "Crie uma senha com pelo menos 6 caracteres."
              );
              return;
            }
            setPassword(registerPassword);
            Alert.alert(
              "Cadastro demonstrativo",
              "Cadastro validado. Para criar uma conta real, conecte ao backend."
            );
            setPage("home");
          })}
        </>
      )
    );
  }

  // ---------- INÍCIO ----------
  if (page === "home") {
    return shell(
      <>
        <View
          style={{
            backgroundColor: RED,
            padding: 16,
            paddingTop: 10,
            paddingBottom: 20,
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
          }}
        >
          <Text style={{ color: WHITE }}>Olá, {name || "Cliente"}</Text>
          <Text
            style={{
              color: WHITE,
              fontFamily: "Georgia",
              fontStyle: "italic",
              fontSize: 30,
            }}
          >
            Veneza
          </Text>
          <Text
            style={{
              color: WHITE,
              fontWeight: "bold",
              letterSpacing: 2,
              fontSize: 10,
            }}
          >
            SANTA MASSA
          </Text>
          <View style={{ marginTop: 14 }}>
            {field("⌕  Buscar pizzas, bebidas...", search, setSearch, {
              returnKeyType: "search",
              onSubmitEditing: () => setPage("menu"),
              style: { marginBottom: 0, borderWidth: 0 },
            })}
          </View>
        </View>

        {scroll(
          <>
            <View
              style={{
                backgroundColor: RED_DARK,
                borderRadius: 18,
                padding: 18,
                marginBottom: 16,
              }}
            >
              <Text style={{ color: "#FBE1D5" }}>Oferta do dia</Text>
              <Text
                style={{
                  color: WHITE,
                  fontSize: 22,
                  fontWeight: "bold",
                  fontFamily: "Georgia",
                  marginVertical: 5,
                }}
              >
                2ª pizza com{"\n"}30% de desconto
              </Text>
              <Text style={{ color: WHITE, fontSize: 12 }}>
                Válido hoje, a partir das 18h
              </Text>
              {btn(
                "Pedir agora",
                () => {
                  setCategory("Todas");
                  setPage("menu");
                },
                false,
                {
                  backgroundColor: WHITE,
                  alignSelf: "flex-start",
                  paddingHorizontal: 22,
                  marginTop: 10,
                }
              )}
            </View>

            <Text
              style={{
                fontSize: 19,
                fontFamily: "Georgia",
                fontWeight: "bold",
                marginBottom: 8,
              }}
            >
              Categorias
            </Text>
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "space-between",
              }}
            >
              {[
                "Mais Pedidas",
                "Salgadas",
                "Doces",
                "Veganas",
                "Bebidas",
                "Monte a Sua",
              ].map((cat, index) => (
                <TouchableOpacity
                  key={cat}
                  onPress={() => {
                    setCategory(cat);
                    setPage("menu");
                  }}
                  style={{
                    width: "32%",
                    backgroundColor: WHITE,
                    borderRadius: 15,
                    padding: 12,
                    marginBottom: 8,
                    alignItems: "center",
                    minHeight: 65,
                    justifyContent: "center",
                  }}
                >
                  <Text style={{ fontSize: 21 }}>
                    {["♨", "◉", "★", "♧", "▣", "◌"][index]}
                  </Text>
                  <Text
                    style={{
                      fontSize: 10,
                      color: "#573C30",
                      marginTop: 3,
                      textAlign: "center",
                    }}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: 10,
                marginBottom: 8,
              }}
            >
              <Text
                style={{
                  fontSize: 19,
                  fontFamily: "Georgia",
                  fontWeight: "bold",
                }}
              >
                Mais Pedidas
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setCategory("Todas");
                  setPage("menu");
                }}
              >
                <Text style={{ color: RED }}>Ver todas</Text>
              </TouchableOpacity>
            </View>
            {PIZZAS.slice(0, 3).map(pizzaCard)}
          </>
        )}
      </>,
      true
    );
  }

  // ---------- CARDÁPIO ----------
  if (page === "menu") {
    const filtered = PIZZAS.filter(
      (pizza) =>
        (category === "Todas" ||
          pizza.category === category ||
          (category === "Mais Pedidas" && pizza.id === 1)) &&
        pizza.name.toLowerCase().includes(search.toLowerCase())
    );

    return shell(
      <>
        {heading(
          "Cardápio",
          category === "Todas" ? "Escolha sua pizza favorita" : category
        )}
        {scroll(
          <>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              style={{ marginBottom: 8 }}
            >
              {["Todas", "Mais Pedidas", "Salgadas", "Doces"].map((cat) => (
                <TouchableOpacity
                  key={cat}
                  onPress={() => setCategory(cat)}
                  style={{
                    paddingVertical: 9,
                    paddingHorizontal: 13,
                    borderRadius: 20,
                    backgroundColor: category === cat ? RED : WHITE,
                    marginRight: 8,
                    marginBottom: 8,
                  }}
                >
                  <Text
                    style={{
                      color: category === cat ? WHITE : RED,
                      fontWeight: "600",
                    }}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            {filtered.length ? (
              filtered.map(pizzaCard)
            ) : (
              <Text style={{ color: MUTED, padding: 20 }}>
                {category === "Veganas"
                  ? "Ainda não há pizzas veganas cadastradas."
                  : category === "Bebidas"
                  ? "Ainda não há bebidas cadastradas."
                  : category === "Monte a Sua"
                  ? "A opção de montar pizza ainda não foi configurada."
                  : "Nenhum item encontrado."}
              </Text>
            )}
          </>
        )}
      </>,
      true
    );
  }

  // ---------- DETALHES DA PIZZA ----------
  if (page === "pizza") {
    return shell(
      <>
        <ScrollView contentContainerStyle={{ paddingBottom: 15 }}>
          <View>
            <Image
              source={{ uri: selectedPizza.image }}
              style={{ width: "100%", height: 270, backgroundColor: BORDER }}
              resizeMode="cover"
            />
            <TouchableOpacity
              onPress={back}
              style={{
                position: "absolute",
                top: 15,
                left: 15,
                backgroundColor: WHITE,
                borderRadius: 25,
                padding: 9,
              }}
            >
              <Text style={{ fontSize: 18 }}>‹</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                setFavorites((old) =>
                  old.includes(selectedPizza.id)
                    ? old.filter((id) => id !== selectedPizza.id)
                    : [...old, selectedPizza.id]
                )
              }
              style={{
                position: "absolute",
                top: 15,
                right: 15,
                backgroundColor: WHITE,
                borderRadius: 25,
                padding: 9,
              }}
            >
              <Text style={{ color: RED, fontSize: 18 }}>
                {favorites.includes(selectedPizza.id) ? "♥" : "♡"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{ padding: 14 }}>
            <Text
              style={{
                fontSize: 25,
                fontFamily: "Georgia",
                fontWeight: "bold",
              }}
            >
              {selectedPizza.name}
            </Text>
            <Text
              style={{
                fontSize: 22,
                color: RED,
                fontWeight: "bold",
                marginVertical: 6,
              }}
            >
              {money(selectedPizza.price)}
            </Text>
            <Text style={{ color: MUTED, fontSize: 12 }}>
              ◷ {selectedPizza.time}   ★ {selectedPizza.rating} · avaliações
            </Text>
            <Text
              style={{ color: MUTED, lineHeight: 21, marginTop: 12 }}
            >
              {selectedPizza.description}
            </Text>

            <Text
              style={{
                fontSize: 16,
                fontWeight: "bold",
                marginTop: 18,
                marginBottom: 8,
              }}
            >
              Ingredientes
            </Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
              {[
                "Molho de tomate artesanal",
                "Mozzarella de búfala",
                "Manjericão fresco",
                "Azeite extra virgem",
              ].map((ingredient) => (
                <Text
                  key={ingredient}
                  style={{
                    borderWidth: 1,
                    borderColor: BORDER,
                    borderRadius: 20,
                    padding: 8,
                    margin: 3,
                    color: MUTED,
                    fontSize: 12,
                  }}
                >
                  {ingredient}
                </Text>
              ))}
            </View>

            <Text
              style={{ fontSize: 16, fontWeight: "bold", marginTop: 18 }}
            >
              Adicionais
            </Text>
            {EXTRAS.map(([extra, price]) => {
              const checked = extras.some((i) => i.name === extra);
              return (
                <TouchableOpacity
                  key={extra}
                  onPress={() =>
                    setExtras((old) =>
                      checked
                        ? old.filter((i) => i.name !== extra)
                        : [...old, { name: extra, price }]
                    )
                  }
                  style={{
                    backgroundColor: WHITE,
                    borderWidth: 1,
                    borderColor: checked ? RED : BORDER,
                    borderRadius: 12,
                    padding: 12,
                    marginTop: 7,
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={{ color: "#3A2922" }}>
                    {checked ? "☑" : "□"}  {extra}
                  </Text>
                  <Text style={{ color: "#C65C00", fontWeight: "700" }}>
                    + {money(price)}
                  </Text>
                </TouchableOpacity>
              );
            })}

            {label("Observações")}
            {field("Ex.: sem cebola, borda recheada...", notes, setNotes, {
              multiline: true,
              style: { height: 78, textAlignVertical: "top" },
            })}

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginVertical: 12,
              }}
            >
              <Text style={{ color: MUTED }}>Quantidade</Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 18,
                }}
              >
                <TouchableOpacity
                  onPress={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Text style={{ color: RED, fontSize: 26 }}>⊖</Text>
                </TouchableOpacity>
                <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                  {quantity}
                </Text>
                <TouchableOpacity
                  onPress={() => setQuantity(quantity + 1)}
                >
                  <Text style={{ color: RED, fontSize: 26 }}>⊕</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>

        <View
          style={{
            paddingHorizontal: 12,
            paddingBottom: 8,
            backgroundColor: CREAM,
          }}
        >
          {btn(
            `Adicionar ao carrinho · ${money(
              (selectedPizza.price +
                extras.reduce((s, i) => s + i.price, 0)) *
                quantity
            )}`,
            addToCart
          )}
        </View>
      </>
    );
  }

  // ---------- CARRINHO ----------
  if (page === "cart") {
    return shell(
      <>
        {heading(
          "Meu Carrinho",
          `${cartCount} ${cartCount === 1 ? "item" : "itens"}`
        )}
        {scroll(
          <>
            {!cart.length &&
              card(
                <>
                  <Text style={{ fontSize: 17, fontWeight: "bold" }}>
                    Seu carrinho está vazio
                  </Text>
                  <Text style={{ color: MUTED, marginVertical: 8 }}>
                    Escolha uma pizza deliciosa para começar.
                  </Text>
                  {btn("Ver cardápio", () => setPage("menu"))}
                </>
              )}

            {cart.map((item) =>
              card(
                <View
                  key={item.key}
                  style={{ flexDirection: "row", alignItems: "center" }}
                >
                  <Image
                    source={{ uri: item.image }}
                    style={{ width: 62, height: 62, borderRadius: 12 }}
                  />
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={{ fontWeight: "bold" }}>{item.name}</Text>
                    <Text
                      style={{ color: RED, fontWeight: "bold", marginTop: 4 }}
                    >
                      {money(item.total * item.quantity)}
                    </Text>
                    {item.extras.length > 0 && (
                      <Text style={{ color: MUTED, fontSize: 11 }}>
                        {item.extras.map((e) => e.name).join(", ")}
                      </Text>
                    )}
                    {!!item.notes && (
                      <Text style={{ color: MUTED, fontSize: 11 }}>
                        Obs.: {item.notes}
                      </Text>
                    )}
                  </View>
                  <View style={{ alignItems: "center" }}>
                    <TouchableOpacity
                      onPress={() => removeItem(item.key)}
                    >
                      <Text style={{ color: RED }}>Remover</Text>
                    </TouchableOpacity>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginTop: 7,
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => changeCartQty(item.key, -1)}
                      >
                        <Text style={{ color: RED, fontSize: 20 }}>−</Text>
                      </TouchableOpacity>
                      <Text
                        style={{ marginHorizontal: 9, fontWeight: "bold" }}
                      >
                        {item.quantity}
                      </Text>
                      <TouchableOpacity
                        onPress={() => changeCartQty(item.key, 1)}
                      >
                        <Text style={{ color: RED, fontSize: 20 }}>＋</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              )
            )}

            {!!cart.length && (
              <>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <View style={{ flex: 1, marginRight: 8 }}>
                    {field("Código do cupom", coupon, setCoupon)}
                  </View>
                  {btn(
                    "Aplicar",
                    () => applyCoupon(),
                    false,
                    { borderRadius: 12, marginTop: 0 }
                  )}
                </View>

                {card(
                  <>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        marginVertical: 4,
                      }}
                    >
                      <Text style={{ color: MUTED }}>Subtotal</Text>
                      <Text>{money(subtotal)}</Text>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        marginVertical: 4,
                      }}
                    >
                      <Text style={{ color: MUTED }}>Taxa de entrega</Text>
                      <Text>{money(deliveryFee)}</Text>
                    </View>
                    {discount > 0 && (
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          marginVertical: 4,
                        }}
                      >
                        <Text style={{ color: GREEN }}>Desconto</Text>
                        <Text style={{ color: GREEN }}>
                          - {money(discount)}
                        </Text>
                      </View>
                    )}
                    {isFreeShipping && (
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          marginVertical: 4,
                        }}
                      >
                        <Text style={{ color: GREEN }}>Frete grátis</Text>
                        <Text style={{ color: GREEN }}>aplicado</Text>
                      </View>
                    )}
                    <View
                      style={{
                        borderTopWidth: 1,
                        borderColor: BORDER,
                        marginTop: 8,
                        paddingTop: 10,
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text style={{ fontWeight: "bold", fontSize: 17 }}>
                        Total
                      </Text>
                      <Text
                        style={{
                          color: RED,
                          fontWeight: "bold",
                          fontSize: 20,
                        }}
                      >
                        {money(total)}
                      </Text>
                    </View>
                  </>
                )}

                {card(
                  <>
                    <Text
                      style={{
                        textAlign: "center",
                        fontFamily: "Georgia",
                        fontWeight: "bold",
                        fontSize: 17,
                        marginBottom: 8,
                      }}
                    >
                      O que deseja fazer?
                    </Text>
                    {btn("Finalizar compra", () => setPage("customer"))}
                    {btn("Continuar comprando", () => setPage("menu"), true)}
                  </>
                )}
              </>
            )}
          </>
        )}
      </>,
      true
    );
  }

  // ---------- PEDIDOS ----------
  if (page === "orders") {
    return shell(
      <>
        {heading("Meus Pedidos", "Histórico completo")}
        {scroll(
          <>
            {orders.length === 0 &&
              card(
                <>
                  <Text style={{ fontWeight: "bold" }}>
                    Você ainda não tem pedidos
                  </Text>
                  <Text style={{ color: MUTED, marginVertical: 8 }}>
                    Seus pedidos aparecerão aqui depois da compra.
                  </Text>
                  {btn("Fazer pedido", () => setPage("home"))}
                </>
              )}

            {orders.map((item) =>
              card(
                <>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text style={{ fontWeight: "bold" }}>{item.id}</Text>
                    <Text style={{ color: GREEN, fontSize: 12 }}>
                      ● {item.status}
                    </Text>
                  </View>
                  <Text style={{ color: MUTED, marginVertical: 8 }}>
                    {item.items}
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ color: MUTED, fontSize: 12 }}>
                      {item.createdAt}
                    </Text>
                    <Text style={{ color: RED, fontWeight: "bold" }}>
                      {money(item.total)}
                    </Text>
                  </View>
                  {btn(
                    "Rastrear pedido",
                    () => {
                      setOrder(item);
                      setPage("tracking");
                    },
                    true
                  )}
                  {btn("Pedir novamente", () => setPage("menu"))}
                </>,
                {
                  borderWidth: item.id === order?.id ? 1 : 0,
                  borderColor: RED,
                }
              )
            )}
          </>
        )}
      </>,
      true
    );
  }

  // ---------- JOGOS (AGORA FUNCIONANDO) ----------
  if (page === "games") {
    // ---- SUBTELA: RODA DA FORTUNA ----
    if (activeGame === "roda") {
      const rotate = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ["0deg", "1440deg"],
      });

      return shell(
        <>
          {backHeader("Roda da Fortuna", "Gire e ganhe cupons")}
          {scroll(
            <>
              <View style={{ alignItems: "center", paddingVertical: 30 }}>
                <Animated.View
                  style={{
                    width: 220,
                    height: 220,
                    borderRadius: 110,
                    borderWidth: 8,
                    borderColor: RED,
                    backgroundColor: CREAM,
                    alignItems: "center",
                    justifyContent: "center",
                    transform: [{ rotate }],
                  }}
                >
                  <Text style={{ fontSize: 70 }}>🍕</Text>
                </Animated.View>

                {wheelResult && (
                  <Text
                    style={{
                      marginTop: 20,
                      fontSize: 20,
                      fontWeight: "bold",
                      color: wheelResult.coupon ? GREEN : RED,
                    }}
                  >
                    {wheelResult.label}
                  </Text>
                )}

                {gameResult && (
                  <Text
                    style={{
                      marginTop: 6,
                      color: GREEN,
                      fontSize: 13,
                      textAlign: "center",
                    }}
                  >
                    Cupom {gameResult.coupon} aplicado no carrinho!
                  </Text>
                )}
              </View>

              {btn(spinning ? "Girando..." : "Girar a roda", spinWheel)}
              {btn(
                "Voltar aos jogos",
                () => {
                  setActiveGame(null);
                  setWheelResult(null);
                  setGameResult(null);
                },
                true
              )}
            </>
          )}
        </>
      );
    }

    // ---- SUBTELA: JOGO DA MEMÓRIA ----
    if (activeGame === "memoria") {
      return shell(
        <>
          {backHeader("Jogo da Memória", "Encontre todos os pares")}
          {scroll(
            <>
              <Text style={{ textAlign: "center", marginBottom: 10 }}>
                Pares: {matched.length / 2}/
                {memoryCards.length ? memoryCards.length / 2 : 4}
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  justifyContent: "center",
                }}
              >
                {memoryCards.map((icon, index) => {
                  const isOpen =
                    flipped.includes(index) || matched.includes(index);
                  return (
                    <TouchableOpacity
                      key={index}
                      onPress={() => flipCard(index)}
                      style={{
                        width: "22%",
                        aspectRatio: 1,
                        margin: "1.5%",
                        borderRadius: 12,
                        backgroundColor: isOpen ? WHITE : RED,
                        borderWidth: 1,
                        borderColor: BORDER,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Text style={{ fontSize: 30 }}>
                        {isOpen ? icon : "❓"}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {gameResult && (
                <Text
                  style={{
                    textAlign: "center",
                    color: GREEN,
                    marginTop: 12,
                    fontWeight: "bold",
                  }}
                >
                  🎉 Você ganhou! Cupom {gameResult.coupon} aplicado.
                </Text>
              )}

              {btn("Novo jogo", startMemory)}
              {btn(
                "Voltar aos jogos",
                () => {
                  setActiveGame(null);
                  setGameResult(null);
                },
                true
              )}
            </>
          )}
        </>
      );
    }

    // ---- SUBTELA: QUIZ ----
    if (activeGame === "quiz") {
      const current = QUIZ[quizIndex];
      return shell(
        <>
          {backHeader(
            "Quiz Pizzaria",
            `Pergunta ${quizIndex + 1} de ${QUIZ.length} · Acertos: ${quizScore}`
          )}
          {scroll(
            <>
              {card(
                <>
                  <Text
                    style={{
                      fontSize: 17,
                      fontWeight: "bold",
                      marginBottom: 10,
                    }}
                  >
                    {current.q}
                  </Text>
                  {current.options.map((opt, i) => (
                    <TouchableOpacity
                      key={i}
                      onPress={() => answerQuiz(i)}
                      style={{
                        backgroundColor: WHITE,
                        borderWidth: 1,
                        borderColor: BORDER,
                        borderRadius: 12,
                        padding: 14,
                        marginVertical: 5,
                      }}
                    >
                      <Text>{opt}</Text>
                    </TouchableOpacity>
                  ))}
                </>
              )}

              {btn(
                "Reiniciar quiz",
                () => {
                  setQuizIndex(0);
                  setQuizScore(0);
                  setGameResult(null);
                },
                true
              )}
              {btn(
                "Voltar aos jogos",
                () => {
                  setActiveGame(null);
                  setQuizIndex(0);
                  setQuizScore(0);
                  setGameResult(null);
                },
                true
              )}
            </>
          )}
        </>
      );
    }

    // ---- LISTA DE JOGOS ----
    return shell(
      <>
        {heading("Jogos & Cupons", "Jogue e ganhe descontos exclusivos")}
        {scroll(
          <>
            {card(
              <Text style={{ color: "#673AB7" }}>
                Escolha um jogo abaixo. Ao ganhar, o cupom é aplicado
                automaticamente no carrinho.
              </Text>
            )}

            {[
              {
                key: "roda",
                icon: "◉",
                title: "Roda da Fortuna",
                desc: "Gire e ganhe cupons",
                bg: RED_DARK,
              },
              {
                key: "memoria",
                icon: "▦",
                title: "Jogo da Memória",
                desc: "Encontre os pares",
                bg: "#A95408",
              },
              {
                key: "quiz",
                icon: "ⓘ",
                title: "Quiz Pizzaria",
                desc: "Responda e desbloqueie",
                bg: "#12643D",
              },
            ].map((g) =>
              card(
                <TouchableOpacity
                  onPress={() => {
                    setActiveGame(g.key);
                    setGameResult(null);
                    if (g.key === "memoria") startMemory();
                    if (g.key === "quiz") {
                      setQuizIndex(0);
                      setQuizScore(0);
                    }
                  }}
                  style={{ flexDirection: "row", alignItems: "center" }}
                >
                  <View
                    style={{
                      backgroundColor: "#F4E4DA",
                      borderRadius: 12,
                      padding: 14,
                      marginRight: 12,
                    }}
                  >
                    <Text style={{ fontSize: 24 }}>{g.icon}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                      {g.title}
                    </Text>
                    <Text
                      style={{ color: MUTED, fontSize: 12, marginTop: 4 }}
                    >
                      {g.desc}
                    </Text>
                  </View>
                  <Text style={{ color: MUTED, fontSize: 24 }}>›</Text>
                </TouchableOpacity>,
                { backgroundColor: g.bg }
              )
            )}
          </>
        )}
      </>,
      true
    );
  }

  // ---------- PERFIL ----------
  if (page === "profile") {
    return shell(
      <>
        <View
          style={{
            backgroundColor: RED,
            borderBottomLeftRadius: 24,
            borderBottomRightRadius: 24,
            alignItems: "center",
            padding: 25,
          }}
        >
          <Text style={{ color: WHITE, fontSize: 44 }}>♙</Text>
          <Text
            style={{
              color: WHITE,
              fontSize: 22,
              fontFamily: "Georgia",
              fontWeight: "bold",
            }}
          >
            {name || "Cliente"}
          </Text>
          <Text style={{ color: "#F9DECE" }}>{email}</Text>
        </View>

        {scroll(
          <>
            {[
              ["▤", "Meus pedidos", "orders"],
              ["⌂", "Endereços salvos", "addresses"],
              ["♡", "Pizzas favoritas", "favorites"],
              ["▣", "Meus cupons", "coupons"],
              ["▱", "Ajuda & Suporte", "support"],
            ].map(([icon, title, target]) => (
              <TouchableOpacity
                key={target}
                onPress={() => setPage(target)}
                style={{
                  backgroundColor: WHITE,
                  borderRadius: 18,
                  padding: 16,
                  marginBottom: 8,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{ color: MUTED, fontSize: 20, marginRight: 12 }}
                >
                  {icon}
                </Text>
                <Text style={{ flex: 1, fontWeight: "600" }}>{title}</Text>
                <Text style={{ color: MUTED, fontSize: 22 }}>›</Text>
              </TouchableOpacity>
            ))}

            {btn(
              "⇥  Sair da conta",
              () => {
                setPassword("");
                setPage("welcome");
              },
              false,
              { backgroundColor: "#FCE2E0" }
            )}
          </>
        )}
      </>,
      true
    );
  }

  // ---------- ENDEREÇOS ----------
  if (page === "addresses") {
    return shell(
      <>
        {backHeader("Seus Dados", "Confirme o endereço de entrega")}
        {scroll(
          <>
            {card(
              <>
                {label("Dados do cliente")}
                {field("Nome completo", name, setName)}
                {label("Telefone / WhatsApp")}
                {field("(11) 99999-9999", phone, setPhone, {
                  keyboardType: "phone-pad",
                })}
              </>
            )}
            {label("Endereço de entrega")}
            {card(
              <>
                {field("Rua, número, bairro", address, setAddress)}
                {btn(
                  "Adicionar / salvar endereço",
                  () =>
                    Alert.alert(
                      "Endereço salvo",
                      "Endereço atualizado nesta demonstração."
                    ),
                  true
                )}
              </>
            )}
            {btn("Confirmar endereço", () => setPage("fulfillment"))}
          </>
        )}
      </>
    );
  }

  // ---------- FAVORITOS ----------
  if (page === "favorites") {
    return shell(
      <>
        {backHeader("Pizzas favoritas")}
        {scroll(
          <>
            {PIZZAS.filter((p) => favorites.includes(p.id)).map(pizzaCard)}
            {!favorites.length && (
              <Text style={{ color: MUTED, marginTop: 15 }}>
                Toque no coração de uma pizza para salvá-la aqui.
              </Text>
            )}
          </>
        )}
      </>
    );
  }

  // ---------- CUPONS ----------
  if (page === "coupons") {
    return shell(
      <>
        {backHeader("Meus cupons")}
        {scroll(
          <>
            {Object.entries(VALID_COUPONS).map(([code, data]) =>
              card(
                <View key={code}>
                  <Text style={{ fontWeight: "bold", color: RED }}>
                    {code}
                  </Text>
                  <Text style={{ color: MUTED }}>{data.label} no pedido.</Text>
                </View>
              )
            )}
          </>
        )}
      </>
    );
  }

  // ---------- SUPORTE ----------
  if (page === "support") {
    return shell(
      <>
        {backHeader("Ajuda & Suporte")}
        {scroll(
          <>
            {card(
              <>
                <Text style={{ fontWeight: "bold" }}>
                  Como podemos ajudar?
                </Text>
                <Text style={{ color: MUTED, marginVertical: 8 }}>
                  Para suporte real, conecte esta área ao atendimento da
                  pizzaria.
                </Text>
                {btn("Falar com atendimento", () =>
                  Alert.alert(
                    "Suporte",
                    "Configure aqui o WhatsApp ou canal de atendimento."
                  )
                )}
              </>
            )}
          </>
        )}
      </>
    );
  }

  // ---------- DADOS DO CLIENTE ----------
  if (page === "customer") {
    return shell(
      <>
        {backHeader("Seus Dados", "Confirme o endereço de entrega")}
        {scroll(
          <>
            {card(
              <>
                {label("Nome completo")}
                {field("Nome completo", name, setName)}
                {label("Telefone / WhatsApp")}
                {field("(11) 99999-9999", phone, setPhone, {
                  keyboardType: "phone-pad",
                })}
              </>
            )}
            {label("Endereço de entrega")}
            {card(
              <TouchableOpacity onPress={() => setPage("addresses")}>
                <Text style={{ color: RED, fontWeight: "bold" }}>
                  ●  Casa (padrão)
                </Text>
                <Text style={{ color: MUTED, marginTop: 6 }}>
                  {address}
                </Text>
                <Text style={{ color: RED, marginTop: 8 }}>
                  Alterar endereço ›
                </Text>
              </TouchableOpacity>
            )}
            {btn("Confirmar endereço", () => setPage("fulfillment"))}
          </>
        )}
      </>
    );
  }

  // ---------- ENTREGA OU RETIRADA ----------
  if (page === "fulfillment") {
    return shell(
      <>
        {backHeader("Como prefere?", "Entrega ou retirada no local")}
        {scroll(
          <>
            {[
              ["Entrega em casa", "~40 min · R$ 6,90"],
              ["Retirada na loja", "Pronto em ~20 min · Grátis"],
            ].map(([option, description]) => (
              <TouchableOpacity
                key={option}
                onPress={() => setDelivery(option)}
                style={{
                  backgroundColor: WHITE,
                  borderWidth: delivery === option ? 1 : 0,
                  borderColor: RED,
                  borderRadius: 16,
                  padding: 16,
                  marginVertical: 6,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                    {option}
                  </Text>
                  <Text style={{ color: MUTED, marginTop: 4 }}>
                    {description}
                  </Text>
                </View>
                <Text style={{ color: RED, fontSize: 20 }}>
                  {delivery === option ? "⦿" : "◯"}
                </Text>
              </TouchableOpacity>
            ))}

            {card(
              <>
                <Text style={{ color: MUTED }}>
                  ⌖ Rua Veneza, 42 · Centro · São Paulo, SP
                </Text>
                <Text
                  style={{
                    color: "#9B4D00",
                    fontWeight: "bold",
                    marginTop: 5,
                  }}
                >
                  Seg–Sex 18h–23h · Sáb–Dom 17h–00h
                </Text>
              </>
            )}

            {btn("Continuar para pagamento", () => setPage("payment"))}
          </>
        )}
      </>
    );
  }

  // ---------- PAGAMENTO ----------
  if (page === "payment") {
    return shell(
      <>
        {backHeader("Pagamento", `Total: ${money(total)}`)}
        {scroll(
          <>
            {[
              "PIX",
              "Cartão de Crédito",
              "Cartão de Débito",
              "Dinheiro",
            ].map((option, index) => (
              <TouchableOpacity
                key={option}
                onPress={() => setPayment(option)}
                style={{
                  backgroundColor: WHITE,
                  borderRadius: 16,
                  borderWidth: payment === option ? 1 : 0,
                  borderColor: RED,
                  padding: 15,
                  marginVertical: 5,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: "bold", fontSize: 15 }}>
                    {option}
                  </Text>
                  <Text style={{ color: MUTED, fontSize: 12 }}>
                    {
                      [
                        "Pagamento instantâneo",
                        "Visa, Mastercard, Elo",
                        "Visa, Mastercard, Elo",
                        "Pagamento na entrega",
                      ][index]
                    }
                  </Text>
                </View>
                <Text style={{ color: RED, fontSize: 20 }}>
                  {payment === option ? "⦿" : "◯"}
                </Text>
              </TouchableOpacity>
            ))}

            {payment === "PIX" &&
              card(
                <View style={{ alignItems: "center" }}>
                  <Text style={{ fontWeight: "bold" }}>PIX selecionado</Text>
                  <Text
                    style={{
                      color: MUTED,
                      textAlign: "center",
                      marginVertical: 8,
                    }}
                  >
                    O QR Code real deve ser gerado pelo provedor de pagamentos
                    integrado ao backend.
                  </Text>
                  <Text style={{ fontSize: 32 }}>▦ ▦ ▦</Text>
                  <Text style={{ color: MUTED, marginTop: 6 }}>
                    Chave PIX demonstrativa
                  </Text>
                  <Text style={{ fontWeight: "bold", color: RED }}>
                    venezasantamassa@pix.com.br
                  </Text>
                  {btn(
                    "Copiar chave (demonstração)",
                    () =>
                      Alert.alert(
                        "Atenção",
                        "Esta chave é fictícia. Não realize pagamentos reais."
                      ),
                    true
                  )}
                </View>
              )}

            {payment === "Dinheiro" &&
              card(
                <>
                  {label("Troco para quanto?")}
                  {field("R$ 0,00", changeFor, setChangeFor, {
                    keyboardType: "decimal-pad",
                  })}
                  <Text style={{ color: MUTED }}>
                    Deixe em branco se não precisar de troco.
                  </Text>
                </>
              )}

            {btn("Revisar pedido", () => setPage("review"))}
          </>
        )}
      </>
    );
  }

  // ---------- REVISÃO ----------
  if (page === "review") {
    return shell(
      <>
        {backHeader("Revisar Pedido")}
        {scroll(
          <>
            {card(
              <>
                <Text style={{ fontWeight: "bold", color: RED }}>
                  ♧  Itens
                </Text>
                {cart.map((item) => (
                  <View
                    key={item.key}
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginTop: 10,
                    }}
                  >
                    <Text style={{ flex: 1 }}>
                      {item.quantity}x {item.name}
                    </Text>
                    <Text style={{ color: RED, fontWeight: "bold" }}>
                      {money(item.total * item.quantity)}
                    </Text>
                  </View>
                ))}
              </>
            )}

            {card(
              <>
                <Text style={{ fontWeight: "bold", color: "#573C30" }}>
                  ⌖  Entrega
                </Text>
                <Text style={{ color: MUTED, marginTop: 10 }}>
                  {delivery === "Entrega em casa"
                    ? address
                    : "Retirada na loja"}
                </Text>
              </>
            )}

            {card(
              <>
                <Text style={{ fontWeight: "bold", color: "#573C30" }}>
                  ▱  Pagamento
                </Text>
                <Text style={{ color: MUTED, marginTop: 10 }}>{payment}</Text>
                {payment === "Dinheiro" && !!changeFor && (
                  <Text style={{ color: GREEN, marginTop: 5 }}>
                    Troco para: {changeFor}
                  </Text>
                )}
              </>
            )}

            {card(
              <>
                {[
                  ["Subtotal", money(subtotal)],
                  ["Entrega", money(deliveryFee)],
                  ...(discount
                    ? [["Desconto", `- ${money(discount)}`]]
                    : []),
                ].map(([key, value]) => (
                  <View
                    key={key}
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginVertical: 4,
                    }}
                  >
                    <Text style={{ color: MUTED }}>{key}</Text>
                    <Text>{value}</Text>
                  </View>
                ))}
                <View
                  style={{
                    borderTopWidth: 1,
                    borderColor: BORDER,
                    paddingTop: 10,
                    marginTop: 5,
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                    Total
                  </Text>
                  <Text
                    style={{
                      color: RED,
                      fontWeight: "bold",
                      fontSize: 20,
                    }}
                  >
                    {money(total)}
                  </Text>
                </View>
              </>
            )}

            {btn("Confirmar pedido", confirmOrder)}
          </>
        )}
      </>
    );
  }

  // ---------- CONFIRMAÇÃO ----------
  if (page === "confirmation") {
    return shell(
      scroll(
        <View style={{ alignItems: "center", paddingTop: 35 }}>
          <View
            style={{
              backgroundColor: "#DDF3E4",
              borderRadius: 60,
              width: 100,
              height: 100,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: GREEN, fontSize: 54 }}>✓</Text>
          </View>
          <Text
            style={{
              color: GREEN,
              fontSize: 27,
              fontWeight: "bold",
              fontFamily: "Georgia",
              marginTop: 18,
            }}
          >
            Pedido confirmado!
          </Text>
          <Text
            style={{
              color: MUTED,
              textAlign: "center",
              marginTop: 8,
            }}
          >
            Obrigado por escolher a Veneza Santa Massa.
          </Text>

          {card(
            <>
              <Text style={{ color: MUTED, textAlign: "center" }}>
                Número do pedido
              </Text>
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 24,
                  color: RED,
                  fontWeight: "bold",
                  marginVertical: 7,
                }}
              >
                {order?.id}
              </Text>
              <Text style={{ textAlign: "center" }}>{order?.items}</Text>
              <Text
                style={{
                  textAlign: "center",
                  color: RED,
                  fontWeight: "bold",
                  fontSize: 20,
                  marginTop: 10,
                }}
              >
                {money(order?.total || 0)}
              </Text>
              <Text
                style={{
                  color: MUTED,
                  textAlign: "center",
                  marginTop: 8,
                }}
              >
                Previsão:{" "}
                {delivery === "Retirada na loja"
                  ? "cerca de 20 minutos"
                  : "cerca de 40 minutos"}
              </Text>
            </>,
            { width: "100%", marginTop: 20 }
          )}

          {btn("Rastrear pedido", () => setPage("tracking"), false, {
            width: "100%",
            marginTop: 16,
          })}
          {btn("Voltar ao início", () => setPage("home"), true, {
            width: "100%",
          })}
        </View>
      )
    );
  }

  // ---------- RASTREAMENTO ----------
  if (page === "tracking") {
    const statuses = [
      "Pedido recebido",
      "Pedido confirmado",
      "Preparando a pizza",
      "Saiu para entrega",
      "Pedido entregue",
    ];
    const current = Math.max(
      0,
      statuses.indexOf(order?.status || "Pedido recebido")
    );

    return shell(
      <>
        {backHeader("Rastrear Pedido", order?.id || "Pedido")}
        {scroll(
          <>
            {card(
              <>
                <Text
                  style={{
                    color: RED,
                    fontWeight: "bold",
                    fontSize: 18,
                  }}
                >
                  Seu pedido está sendo acompanhado!
                </Text>
                <Text style={{ color: MUTED, marginTop: 5 }}>
                  Previsão de entrega: aproximadamente 40 minutos.
                </Text>
              </>
            )}

            {card(
              <>
                {statuses.map((status, index) => (
                  <View
                    key={status}
                    style={{ flexDirection: "row", minHeight: 55 }}
                  >
                    <View style={{ width: 32, alignItems: "center" }}>
                      <View
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: 12,
                          backgroundColor:
                            index <= current ? GREEN : "#E7D9CF",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Text
                          style={{ color: WHITE, fontWeight: "bold" }}
                        >
                          {index <= current ? "✓" : "·"}
                        </Text>
                      </View>
                      {index < statuses.length - 1 && (
                        <View
                          style={{
                            width: 2,
                            flex: 1,
                            backgroundColor:
                              index < current ? GREEN : "#E7D9CF",
                          }}
                        />
                      )}
                    </View>
                    <View
                      style={{
                        flex: 1,
                        paddingLeft: 10,
                        paddingBottom: 14,
                      }}
                    >
                      <Text
                        style={{
                          fontWeight:
                            index === current ? "bold" : "normal",
                          color: index <= current ? "#2B211C" : MUTED,
                        }}
                      >
                        {status}
                      </Text>
                      {index === current && (
                        <Text
                          style={{
                            color: GREEN,
                            fontSize: 12,
                            marginTop: 3,
                          }}
                        >
                          Status atual
                        </Text>
                      )}
                    </View>
                  </View>
                ))}
              </>
            )}

            <Text style={{ color: MUTED, fontSize: 12, marginTop: 5 }}>
              Demonstração: o status só muda automaticamente quando conectado
              ao backend.
            </Text>

            {btn(
              "Atualizar status",
              () =>
                Alert.alert(
                  "Status do pedido",
                  `Status atual: ${
                    order?.status || "Pedido recebido"
                  }. A atualização real depende do backend.`
                ),
              true
            )}
            {btn("Ver meus pedidos", () => setPage("orders"))}
            {btn("Voltar ao início", () => setPage("home"), true)}
          </>
        )}
      </>
    );
  }

  // ---------- FALLBACK ----------
  return shell(
    scroll(
      <>
        {backHeader("Veneza Santa Massa")}
        {card(
          <>
            <Text>Esta tela ainda não foi configurada.</Text>
            {btn("Voltar ao início", () => setPage("home"))}
          </>
        )}
      </>
    )
  );
}