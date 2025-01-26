'use client';

import { Button, Card,CardHeader, CardBody, CardFooter,Image} from "@nextui-org/react";
import { useRouter } from "next/navigation"; // Use `next/navigation` for client-side routing

const MainContainer = () => {
  const router = useRouter();

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Sonni's Verwaltungstool</h1>
      <div className="text-center flex justify-center gap-4">
        {/* Handle navigation programmatically with useRouter */}
        <Card
          className="col-span-12 sm:col-span-4 h-[300px] cursor-pointer transition duration-300 ease-in-out hover:scale-105"
          isPressable
          onPress={() => router.push('/events')}
        >
        <CardHeader className="absolute z-10 top-1 flex-col !items-start">
          <p className="text-xl text-white uppercase font-bold">Events</p>
          
        </CardHeader>
        <Image
          removeWrapper
          alt="Card background"
          className="z-0 w-full h-full object-cover"
          src="https://heroui.com/images/card-example-4.jpeg"
        />
      </Card>
      <Card
          className="col-span-12 sm:col-span-4 h-[300px] cursor-pointer transition duration-300 ease-in-out hover:scale-105"
          isPressable
          onPress={() => router.push('/mitarbeiter')}
        >
        <CardHeader className="absolute z-10 top-1 flex-col !items-start">
          <p className="text-xl text-white uppercase font-bold">Mitarbeiter</p>
          
        </CardHeader>
        <Image
          removeWrapper
          alt="Card background"
          className="z-0 w-full h-full object-cover"
          src="https://heroui.com/images/album-cover.png"
        />
      </Card>
      <Card
          className="col-span-12 sm:col-span-4 h-[300px] cursor-pointer transition duration-300 ease-in-out hover:scale-105"
          isPressable
          onPress={() => router.push('/objects')}
        >
        <CardHeader className="absolute z-10 top-1 flex-col !items-start">
          <p className="text-xl text-white uppercase font-bold">Equipments</p>
          
        </CardHeader>
        <Image
          removeWrapper
          alt="Card background"
          className="z-0 w-full h-full object-cover"
          src="https://heroui.com/images/card-example-6.jpeg"
        />
      </Card>
        
      </div>
    </div>
  );
};

export default MainContainer;
