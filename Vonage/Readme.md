# Sofya Transcription

## Exemplo com o Vonage  

### Passos para Configuração e Execução
1. **Altere as Variáveis de Configuração:**  

Edite o arquivo `config.js` e insira suas chaves e IDs: 

```javascript

const  config  = {

azureSpeechKey:  'your_azure_speech_key',

azureRegion:  'your_azure_region',

appId:  'your_app_id',

sessionId:  'your_session_id',

token:  'your_token'

};
```

2. **Instale as Dependências:**
	`npm i`
  

3. **Inicie a Aplicação:**
	 `npm start`
    
4. **Permissões de Câmera e Microfone:**
	Como o aplicativo solicitará permissões para usar a câmera e o microfone, é recomendável usar uma ferramenta como o [ngrok](https://ngrok.com/) para gerar um link HTTPS.

5. **Transcrição:**

	Para que a transcrição ocorra, o médico deve acessar o cliente com o parâmetro de query `/ ?doctor=true` no link, e o paciente deve acessar o link sem esse parâmetro de query.

Exemplo:

-   Médico: `https://example.ngrok.io/?doctor=true`
-   Paciente: `https://example.ngrok.io`
 