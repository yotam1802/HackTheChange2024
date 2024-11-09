import Image from 'next/image';

export default function Page() {
  const data = {
    title: "Dynamic Title from API",
    imageUrl: "/image.jpg",
    description: "This is a dynamically loaded description that provides details about the content."
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground p-6 overflow-auto">
        <Link href="/map">
            <button className="absolute top-6 left-6 p-3 bg-blue-500 text-white rounded-full shadow-md hover:bg-blue-600">
            Back
            </button>
        </Link>
        <h1 className="text-4xl font-bold text-center my-6">{data.title}</h1>
        <div className="relative w-full h-[500px] rounded-md overflow-hidden">
            <Image
                src={data.imageUrl}
                alt={data.title}
                layout="fill"
                objectFit="contain"
                className="object-cover"
            />
        </div>
        <p className="text-lg my-6 text-center">{data.description}</p>
        <p className="text-lg my-6 text-center">As the world becomes more interconnected through technology, the importance of data security continues to grow. New advancements in encryption and cybersecurity are constantly being developed to safeguard sensitive information from evolving threats. Organizations are now adopting more robust security measures to protect their data, ensuring compliance with regulatory standards and building trust with consumers. In addition to cybersecurity protocols, businesses are increasingly using artificial intelligence to monitor and respond to potential risks in real-time, making it easier to prevent data breaches before they occur. The integration of AI and machine learning into security systems is reshaping the way we think about online safety, providing innovative solutions to protect personal and corporate data alike.</p>
    </div>
  );
}


