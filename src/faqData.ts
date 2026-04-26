export interface FaqItem {
  id: string;
  title: Record<string, string>;
  content: Record<string, string>;
}

export const FAQ_DATA: Record<string, FaqItem[]> = {
  about: [
    {
      id: 'mining-steps',
      title: {
        en: "Mining Steps",
        fr: "Étapes minières",
        ar: "خطوات التعدين",
        es: "Pasos de minería",
        ru: "Шаги майнинга"
      },
      content: {
        en: "TERAC's AI mining is the world's most advanced mining technology. Once your AI mining account is activated, you can access the mining pool to collect your daily earnings and transfer them to your cryptocurrency wallet.\n\nTERAC supports asset deposits and withdrawals on BEP-20 and TRC-20 networks.\n\nTERAC mining machines are accessible from Monday to Saturday and are inspected every Sunday.",
        fr: "Le minage par IA de TERAC est la technologie de minage la plus avancée au monde. Une fois votre compte de minage par IA activé, vous pouvez accéder au pool de minage pour collecter vos gains quotidiens et les transférer vers votre portefeuille de cryptomonnaies.\n\nTERAC prend en charge les dépôts et les retraits d'actifs sur les réseaux BEP-20 et TRC-20.\n\nLes machines minières de TERAC sont accessibles du lundi au samedi et sont inspectées tous les dimanches.",
        ar: "يعد تعدين الذكاء الاصطناعي من TERAC أكثر تكنولوجيا التعدين تقدمًا في العالم. بمجرد تنشيط حساب تعدين الذكاء الاصطناعي الخاص بك، يمكنك الوصول إلى مجمع التعدين لجمع أرباحك اليومية ونقلها إلى محفظة العملات الرقمية الخاصة بك.\n\nتدعم TERAC إيداع وسحب الأصول على شبكات BEP-20 و TRC-20.\n\nيمكن الوصول إلى آلات تعدين TERAC من الاثنين إلى السبت ويتم فحصها كل يوم أحد.",
        es: "La minería de IA de TERAC es la tecnología de minería más avanzada del mundo. Una vez que se activa su cuenta de minería de IA, puede acceder al grupo de minería para cobrar sus ganancias diarias y transferirlas a su billetera de criptomonedas.\n\nTERAC admite depósitos y retiros de activos en las redes BEP-20 y TRC-20.\n\nLas máquinas de minería de TERAC son accesibles de lunes a sábado y se inspeccionan todos los domingos.",
        ru: "ИИ-майнинг TERAC — это самая передовая в мире технология майнинга. Как только ваш аккаунт для ИИ-майнинга будет активирован, вы сможете получить доступ к майнинг-пулу, чтобы собирать свою ежедневную прибыль и переводить ее на свой криптовалютный кошелек.\n\nTERAC поддерживает ввод и вывод активов в сетях BEP-20 и TRC-20.\n\nМайнинговые машины TERAC доступны с понедельника по субботу и проверяются каждое воскресенье."
      }
    }
  ],
  welfare: [
    {
      id: 'commission-benefits',
      title: {
        en: "Commission Benefits",
        fr: "Avantages liés aux commissions",
        ar: "مزايا العمولات",
        es: "Beneficios de las comisiones",
        ru: "Комиссионные льготы"
      },
      content: {
        en: "Increased TERAC commission for Sundays (US time):\n\n1. You can earn a 20% commission by inviting your referrals to activate an AI mining account. For example, if one of your referrals deposits 100 USDT to activate an account, you will receive a commission of 20 USDT. You can contact online customer service to claim your commission.\n\n2. You can also receive a 25% commission by inviting your referrals to subscribe to investment products with a duration of 180 days or more. For example, if a referral deposits 100 USDT and buys an investment product for 180 days, you will receive 25 USDT. To claim this commission, please contact online customer service.\n\n3. From Monday to Saturday (US time), you can earn a 20% commission for each person you invite to subscribe to an investment product with a duration of 180 days or more. Please contact online customer service to claim your commission. Note: this offer is reserved for clients who have activated their account; unclaimed commissions will be lost.",
        fr: "Augmentation de la commission de TERAC pour les dimanches (heure américaine) :\n\n1. Vous pouvez gagner une commission de 20 % en invitant vos filleuls à activer un compte de minage IA. Par exemple, si l'un de vos filleuls dépose 100 USDT pour activer un compte, vous recevrez une commission de 20 USDT. Vous pouvez contacter le service client en ligne pour réclamer votre commission.\n\n2. Vous pouvez également percevoir une commission de 25 % en invitant vos filleuls à souscrire à des produits d'investissement d'une durée de 180 jours ou plus. Par exemple, si un filleul dépose 100 USDT et achète un produit d'investissement à 180 jours, vous recevrez 25 USDT. Pour réclamer cette commission, veuillez contacter le service client en ligne.\n\n3. Du lundi au samedi (heure américaine), vous pouvez gagner une commission de 20 % pour chaque personne que vous invitez à souscrire à un produit d'investissement d'une durée de 180 jours ou plus. Veuillez contacter le service client en ligne pour réclamer votre commission. Remarque : cette offre est réservée aux clients ayant activé leur compte ; les commissions non réclamées seront perdues.",
        ar: "زيادة عمولة TERAC لأيام الأحد (بتوقيت الولايات المتحدة):\n\n1. يمكنك كسب عمولة بنسبة 20% من خلال دعوة الأشخاص الذين أحلتهم لتفعيل حساب تعدين ذكاء اصطناعي. على سبيل المثال، إذا قام أحد الأشخاص الذين أحلتهم بإيداع 100 USDT لتفعيل حساب، فستتلقى عمولة قدرها 20 USDT. يمكنك الاتصال بخدمة العملاء عبر الإنترنت للمطالبة بعمولتك.\n\n2. يمكنك أيضًا الحصول على عمولة بنسبة 25% من خلال دعوة الأشخاص الذين أحلتهم للاشتراك في منتجات استثمارية مدتها 180 يومًا أو أكثر. على سبيل المثال، إذا قام شخص محال بإيداع 100 USDT واشترى منتجًا استثماريًا لمدة 180 يومًا، فستتلقى 25 USDT. للمطالبة بهذه العمولة، يرجى الاتصال بخدمة العملاء عبر الإنترنت.\n\n3. من الاثنين إلى السبت (بتوقيت الولايات المتحدة)، يمكنك كسب عمولة بنسبة 20% عن كل شخص تدعوه للاشتراك في منتج استثماري مدته 180 يومًا أو أكثر. يرجى الاتصال بخدمة العملاء عبر الإنترنت للمطالبة بعمولتك. ملاحظة: هذا العرض محجوز للعملاء الذين قاموا بتفعيل حساباتهم؛ ستضيع العمولات غير المطالب بها.",
        es: "Aumento de la comisión de TERAC para los domingos (hora de EE. UU.):\n\n1. Puede ganar una comisión del 20 % invitando a sus referidos a activar una cuenta de minería de IA. Por ejemplo, si uno de sus referidos deposita 100 USDT para activar una cuenta, recibirá una comisión de 20 USDT. Puede ponerse en contacto con el servicio de atención al cliente en línea para reclamar su comisión.\n\n2. También puede recibir una comisión del 25 % invitando a sus referidos a suscribirse a productos de inversión con una duración de 180 días o más. Por ejemplo, si un referido deposita 100 USDT y compra un producto de inversión por 180 días, recibirá 25 USDT. Para reclamar esta comisión, comuníquese con el servicio de atención al cliente en línea.\n\n3. De lunes a sábado (hora de EE. UU.), puede ganar una comisión del 20 % por cada persona que invite a suscribirse a un producto de inversión con una duración de 180 días o más. Comuníquese con el servicio de atención al cliente en línea para reclamar su comisión. Nota: esta oferta está reservada para clientes que hayan activado su cuenta; se perderán las comisiones no reclamadas.",
        ru: "Увеличенная комиссия TERAC по воскресеньям (по американскому времени):\n\n1. Вы можете заработать 20% комиссионных, пригласив своих рефералов активировать аккаунт для ИИ-майнинга. Например, если один из ваших рефералов внесет 100 USDT для активации аккаунта, вы получите комиссию в размере 20 USDT. Вы можете связаться с онлайн-службой поддержки клиентов, чтобы запросить свою комиссию.\n\n2. Вы также можете получить комиссию в размере 25%, если пригласите своих рефералов подписаться на инвестиционные продукты сроком на 180 дней и более. Например, если реферал внесет 100 USDT и купит инвестиционный продукт на 180 дней, вы получите 25 USDT. Чтобы запросить эту комиссию, свяжитесь с онлайн-службой поддержки.\n\n3. С понедельника по субботу (по американскому времени) вы можете получать 20% комиссионных за каждого человека, которого вы приглашаете подписаться на инвестиционный продукт сроком на 180 дней и более. Пожалуйста, свяжитесь с онлайн-службой поддержки клиентов, чтобы запросить свою комиссию. Примечание: это предложение зарезервировано для клиентов, активировавших свой аккаунт; невостребованные комиссии будут потеряны."
      }
    }
  ]
};
