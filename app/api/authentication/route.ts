// export default function POST({ req }: { req: Request }) {
//   const { name, password } = req.json();
//   // checking credentials logic here
//   if (name && password) {
//     return new Response(
//       JSON.stringify({ message: "Authentication successful" }),
//       {
//         status: 200,
//         headers: {
//           "Content-Type": "application/json",
//         },
//       }
//     );
//   }
//   return new Response(JSON.stringify({ message: "Authentication failed" }), {
//     status: 401,
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });
// }

export default function GET() {
  return new Response(JSON.stringify({ message: "GET method not supported" }), {
    status: 405,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
