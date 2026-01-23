import { Alert } from "@mantine/core";
import { Link } from "react-router-dom";
// import Footer from "../components/Footer";

export default function JoinCommunity() {
  return (
    <>
      <div className="w-full relative grid place-items-center my-8 gap-8 p-2">
        <div className="max-w-5xl flex flex-col gap-3">
          <h1 className="text-2xl text-center font-semibold">
            Join our community!
          </h1>
          <p className="text-justify">
            Join our vibrant community and connect with like-minded individuals
            passionate about innovation and collaboration. Engage in enriching
            discussions, share ideas, and access valuable resources that empower
            personal and professional growth. Together, we can create impactful
            solutions and inspire change. Become a part of our journey today!
          </p>
        </div>

        <Alert
          color="green"
          title="Join Stem for Society WhatsApp group to get update related to upcoming
          Events, trainings, workshop"
          classNames={{
            title: "lg:text-lg",
            message: "grid gap-4 place-items-center",
          }}
          //   icon={<MdAnnouncement size={32} />}
        >
          <Link
            className="lg:text-base text-sm font-semibold text-blue-500 underline"
            to={"https://chat.whatsapp.com/Epro4DSJ4qG4qf1D9vsEep"}
            target="_blank"
          >
            https://chat.whatsapp.com/Epro4DSJ4qG4qf1D9vsEep
          </Link>
          <img
            src="/qr.jpeg"
            className="w-96 h-auto"
            alt="https://chat.whatsapp.com/Epro4DSJ4qG4qf1D9vsEep"
          />
        </Alert>
      </div>
      {/* <Footer /> */}
    </>
  );
}
