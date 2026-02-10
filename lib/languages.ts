/**
 * Language cost comparison.
 * Translates human-readable values in structured docs to show
 * how token cost varies across languages. Keys stay in English
 * since they're code-facing. Only string values get translated.
 */

export interface LanguageOption {
  code: string;
  label: string;
  nativeLabel: string;
  flag: string;
}

export const LANGUAGES: LanguageOption[] = [
  { code: "en", label: "English", nativeLabel: "English", flag: "🇺🇸" },
  { code: "es", label: "Spanish", nativeLabel: "Español", flag: "🇪🇸" },
  { code: "fr", label: "French", nativeLabel: "Français", flag: "🇫🇷" },
  { code: "zh", label: "Chinese", nativeLabel: "中文", flag: "🇨🇳" },
];

/**
 * Static translations for common documentation strings.
 * In a production tool you'd hit a translation API, but for a
 * demo this keeps us on the free tier with zero API calls.
 */
const TRANSLATIONS: Record<string, Record<string, string>> = {
  // OpenAPI example strings
  "Get a user by ID": {
    es: "Obtener un usuario por ID",
    fr: "Obtenir un utilisateur par ID",
    zh: "通过ID获取用户",
  },
  "Returns a single user object. Requires authentication via Bearer token in the Authorization header.":
    {
      es: "Devuelve un objeto de usuario único. Requiere autenticación mediante token Bearer en el encabezado Authorization.",
      fr: "Renvoie un objet utilisateur unique. Nécessite une authentification via un jeton Bearer dans l'en-tête Authorization.",
      zh: "返回单个用户对象。需要在Authorization头中通过Bearer令牌进行身份验证。",
    },
  "The unique identifier of the user": {
    es: "El identificador único del usuario",
    fr: "L'identifiant unique de l'utilisateur",
    zh: "用户的唯一标识符",
  },
  "Related resources to include in the response": {
    es: "Recursos relacionados para incluir en la respuesta",
    fr: "Ressources associées à inclure dans la réponse",
    zh: "要包含在响应中的相关资源",
  },
  "Successful response": {
    es: "Respuesta exitosa",
    fr: "Réponse réussie",
    zh: "成功响应",
  },
  "User not found": {
    es: "Usuario no encontrado",
    fr: "Utilisateur non trouvé",
    zh: "未找到用户",
  },

  // Error code strings
  "Invalid authentication token": {
    es: "Token de autenticación no válido",
    fr: "Jeton d'authentification invalide",
    zh: "无效的身份验证令牌",
  },
  "The provided token is expired, malformed, or has been revoked. Generate a new token via the /auth/token endpoint.":
    {
      es: "El token proporcionado está expirado, es incorrecto o ha sido revocado. Genere un nuevo token a través del endpoint /auth/token.",
      fr: "Le jeton fourni est expiré, malformé ou a été révoqué. Générez un nouveau jeton via le point de terminaison /auth/token.",
      zh: "提供的令牌已过期、格式错误或已被撤销。请通过/auth/token端点生成新令牌。",
    },
  "Re-authenticate using your credentials or refresh token": {
    es: "Vuelva a autenticarse utilizando sus credenciales o token de actualización",
    fr: "Réauthentifiez-vous en utilisant vos identifiants ou votre jeton de rafraîchissement",
    zh: "使用您的凭据或刷新令牌重新进行身份验证",
  },
  "Insufficient permissions": {
    es: "Permisos insuficientes",
    fr: "Permissions insuffisantes",
    zh: "权限不足",
  },
  "Your token is valid but lacks the required scope for this operation.": {
    es: "Su token es válido pero carece del alcance requerido para esta operación.",
    fr: "Votre jeton est valide mais ne dispose pas de la portée requise pour cette opération.",
    zh: "您的令牌有效，但缺少此操作所需的范围。",
  },
  "Request additional scopes from your organization admin": {
    es: "Solicite alcances adicionales al administrador de su organización",
    fr: "Demandez des portées supplémentaires à l'administrateur de votre organisation",
    zh: "向您的组织管理员请求额外的权限范围",
  },
  "Rate limit exceeded": {
    es: "Límite de velocidad excedido",
    fr: "Limite de débit dépassée",
    zh: "超出速率限制",
  },
  "You have exceeded the maximum number of requests allowed in the current time window.":
    {
      es: "Ha excedido el número máximo de solicitudes permitidas en la ventana de tiempo actual.",
      fr: "Vous avez dépassé le nombre maximum de requêtes autorisées dans la fenêtre de temps actuelle.",
      zh: "您已超过当前时间窗口中允许的最大请求数。",
    },
  "Wait for the Retry-After header duration, then retry. Consider implementing exponential backoff.":
    {
      es: "Espere la duración del encabezado Retry-After y luego reintente. Considere implementar un retroceso exponencial.",
      fr: "Attendez la durée indiquée par l'en-tête Retry-After, puis réessayez. Envisagez d'implémenter un backoff exponentiel.",
      zh: "等待Retry-After头部指定的时间后重试。建议实现指数退避策略。",
    },
  "Validation error": {
    es: "Error de validación",
    fr: "Erreur de validation",
    zh: "验证错误",
  },
  "One or more fields in the request body failed validation.": {
    es: "Uno o más campos en el cuerpo de la solicitud no pasaron la validación.",
    fr: "Un ou plusieurs champs du corps de la requête n'ont pas passé la validation.",
    zh: "请求正文中的一个或多个字段未通过验证。",
  },
  "Check the 'details' array in the response for specific field errors": {
    es: "Consulte el array 'details' en la respuesta para errores de campo específicos",
    fr: "Consultez le tableau 'details' dans la réponse pour les erreurs de champ spécifiques",
    zh: "检查响应中的'details'数组以获取具体的字段错误",
  },
};

/**
 * Recursively translate string values in an object.
 * Keys and non-string values are preserved as-is.
 */
function translateValue(value: unknown, langCode: string): unknown {
  if (typeof value === "string") {
    // Check for exact match in translations
    if (TRANSLATIONS[value] && TRANSLATIONS[value][langCode]) {
      return TRANSLATIONS[value][langCode];
    }
    // Return original if no translation found
    return value;
  }

  if (Array.isArray(value)) {
    return value.map((item) => translateValue(item, langCode));
  }

  if (typeof value === "object" && value !== null) {
    const result: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value)) {
      result[key] = translateValue(val, langCode);
    }
    return result;
  }

  return value;
}

/**
 * Translate all human-readable string values in a parsed object.
 * Returns the translated object (keys stay in English).
 */
export function translateDoc(
  parsed: Record<string, unknown>,
  langCode: string
): Record<string, unknown> {
  if (langCode === "en") return parsed;
  return translateValue(parsed, langCode) as Record<string, unknown>;
}
