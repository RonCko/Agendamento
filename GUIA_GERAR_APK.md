# 📱 GUIA: GERAR APK DO APP AGENDAMENTO

## OPÇÃO 1: Build com EAS (Recomendado) ⭐

### Passo 1: Instalar EAS CLI
```powershell
npm install -g eas-cli
```

### Passo 2: Login na Expo
```powershell
cd "c:\Users\eduardo\Desktop\repo_mobile\Agendamento\agendamento"
eas login
```
- Se não tiver conta: https://expo.dev/signup
- Use o mesmo email/senha do Expo Go

### Passo 3: Configurar projeto
```powershell
eas build:configure
```
- Vai criar arquivo `eas.json`
- Selecione perfil de build

### Passo 4: Gerar APK
```powershell
eas build --platform android --profile preview
```
**Importante:** Use `preview` para gerar APK (não AAB)

**Opções:**
- `--profile preview` → APK (instala direto no celular)
- `--profile production` → AAB (para Google Play Store)

### Passo 5: Aguardar build
- Build acontece na nuvem (5-15 minutos)
- Você receberá link de download do APK
- Baixe e instale no celular Android

---

## OPÇÃO 2: Expo Application Services (Mais Simples)

### Via navegador (sem linha de comando):
1. Acesse: https://expo.dev
2. Faça login
3. Clique em "New Project" → "Import from Git"
4. Conecte seu GitHub
5. Selecione o repositório `Agendamento`
6. Configure build Android
7. Clique em "Build" → APK será gerado

---

## OPÇÃO 3: Build Local (Avançado, requer Android Studio)

### Requisitos:
- Android Studio instalado
- Java JDK 11+
- Android SDK configurado

### Comando:
```powershell
npx expo prebuild
cd android
./gradlew assembleRelease
```
APK estará em: `android/app/build/outputs/apk/release/app-release.apk`

---

## DICA RÁPIDA: Testar sem build 🚀

### Expo Go (para testes rápidos):
```powershell
cd "c:\Users\eduardo\Desktop\repo_mobile\Agendamento\agendamento"
npx expo start
```
1. Baixe Expo Go no celular: https://expo.dev/go
2. Escaneie QR code que aparece no terminal
3. App abre instantaneamente

**Limitações:**
- Requer conexão com computador
- Não funciona em produção
- Apenas para desenvolvimento

---

## ARQUIVO DE CONFIGURAÇÃO: eas.json

Crie este arquivo na raiz do projeto:

```json
{
  "cli": {
    "version": ">= 5.9.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "aab"
      }
    }
  }
}
```

---

## INSTALAÇÃO NO CELULAR

1. **Baixe o APK** do link fornecido pelo EAS
2. **No celular Android:**
   - Vá em Configurações → Segurança
   - Habilite "Fontes desconhecidas" ou "Instalar apps desconhecidos"
3. **Abra o arquivo APK** baixado
4. **Clique em "Instalar"**

---

## PROBLEMAS COMUNS

### "Couldn't find credentials"
```powershell
eas credentials
```
Configure credenciais Android manualmente

### "Build failed"
- Verifique `app.json` (android.package deve ser único)
- Certifique-se que nome do pacote não tem espaços
- Exemplo: `com.utfpr.agendamento`

### Tempo de build muito longo
- Normal: 10-20 minutos na primeira vez
- Builds subsequentes: 5-10 minutos

---

## RECOMENDAÇÃO FINAL

Para **testar rapidamente**: Use **Expo Go** (Opção 3)
Para **distribuir para outros**: Use **EAS Build** (Opção 1)
Para **publicar na Play Store**: Use **EAS Build production**

---

## COMANDOS RESUMIDOS

```powershell
# 1. Instalar EAS
npm install -g eas-cli

# 2. Login
cd "c:\Users\eduardo\Desktop\repo_mobile\Agendamento\agendamento"
eas login

# 3. Configurar
eas build:configure

# 4. Gerar APK
eas build --platform android --profile preview

# 5. Baixar APK do link fornecido
```

**Tempo total:** ~15-20 minutos
**Custo:** Grátis (plano free tem limite de builds/mês)
