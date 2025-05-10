// 1. Importowanie niezbędnych modułów AWS SDK
import { DynamoDB, SES } from 'aws-sdk';
// AWS SDK jest preinstalowany w środowisku Lambda

// 2. Inicjalizacja klientów AWS
const db = new DynamoDB.DocumentClient(); // Klient do interakcji z DynamoDB
const ses = new SES(); // Klient do wysyłki e-maili przez Amazon SES

// 3. Główna funkcja Lambda
export const handler = async (event: any) => {
    // 4. Parsowanie danych z frontendu (Angular)
    const { name, email, message } = JSON.parse(event.body);
    // event.body zawiera surowe dane JSON wysłane z Angulara

    // 5. Zapisywanie wiadomości w DynamoDB
    try {
        await db.put({
            TableName: 'ContactMessages', // Nazwa tabeli w DynamoDB
            Item: {
                messageId: Date.now().toString(), // Unikalny ID (timestamp)
                name, // Imię z formularza
                email, // E-mail z formularza
                message, // Treść wiadomości
                createdAt: new Date().toISOString() // Data utworzenia
            },
        }).promise(); // .promise() zamienia callback na async/await
    } catch (dbError) {
        console.error('Błąd DynamoDB:', dbError);
        throw new Error('Nie udało się zapisać wiadomości');
    }

    // 6. Wysyłka e-maila przez Amazon SES
    try {
        await ses.sendEmail({
            Source: 'p.wojkiewicz@gmail.com', // Weryfikowany w SES adres e-mail
            Destination: {
                ToAddresses: ['p.wojkiewicz@gmail.com'] // Gdzie wysłać
            },
            Message: {
                Subject: {
                    Data: 'Nowa wiadomość kontaktowa z AWS' // Temat maila
                },
                Body: {
                    Text: {
                        Data: `Nowa wiadomość od ${name} (${email}):\n\n${message}`
                        // Treść maila w formacie tekstowym
                    },
                    Html: {
                        Data: `<p>Nowa wiadomość od <strong>${name}</strong> (${email}):</p>
                   <p>${message.replace(/\n/g, '<br>')}</p>`
                        // Wersja HTML (opcjonalna)
                    }
                }
            }
        }).promise();
    } catch (sesError) {
        console.error('Błąd SES:', sesError);
        throw new Error('Nie udało się wysłać e-maila');
    }

    // 7. Zwrot odpowiedzi do API Gateway
    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': 'https://d36qsbqdq73v43.cloudfront.net', // Wymagane dla CORS
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: 'Wiadomość zapisana i e-mail wysłany!' })
    };
};
