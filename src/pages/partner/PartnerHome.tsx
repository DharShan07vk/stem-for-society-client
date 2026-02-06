import { Paper, Skeleton, Text } from "@mantine/core";
import { BookOpen, Clock, Users } from "lucide-react";
import PartnerErrorHandler from "../../components/PartnerErrorHandler";
import PayoutStatusBanner from "../../components/PayoutStatusBanner";
import { usePartner, usePartnerHomeData } from "../../lib/hooks";
import { cn } from "../../lib/utils";

export default function PartnerHome() {
  const { user } = usePartner();
  const { data, isLoading, error } = usePartnerHomeData();

  if (error) return <PartnerErrorHandler error={error} />;

  const stats = [
    {
      label: "Total Students",
      value: data?.studentsCount || 0,
      icon: Users,
      color: "blue",
      description: "Enrolled students",
    },
    {
      label: "Active Courses",
      value: data?.trainingsCount || 0,
      icon: BookOpen,
      color: "purple",
      description: "Published trainings",
    },
  ];

  const colorClasses = {
    blue: "bg-blue-50 text-blue-600",
    purple: "bg-purple-50 text-purple-600",
    green: "bg-green-50 text-green-600",
    orange: "bg-orange-50 text-orange-600",
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6 animate-in fade-in duration-500">
      {!user?.user.isApproved ? (
        <div className="min-h-[600px] flex flex-col items-center justify-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Paper
            p="xl"
            withBorder
            className="rounded-xl max-w-2xl w-full bg-gradient-to-br from-yellow-50 to-amber-50 border-amber-200"
          >
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="relative animate-in zoom-in duration-500 delay-200">
                <img
                  src="/Waiting-rafiki.png"
                  className="w-80 h-80 object-contain"
                  alt="Waiting for approval"
                />
                <div className="absolute top-0 right-0 animate-pulse">
                  <Clock className="text-amber-500" size={32} />
                </div>
              </div>
              <div className="space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-300">
                <Text size="xl" fw={600} className="text-amber-600">
                  Account Pending Approval
                </Text>
                <Text size="sm" className="text-amber-800 max-w-md">
                  Our team is reviewing your application. You'll receive a notification once your account is activated. Thank you for your patience!
                </Text>
              </div>
            </div>
          </Paper>
        </div>
      ) : (
        <>
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg p-8 text-white animate-in slide-in-from-top-4 duration-500">
            <Text size="xl" fw={600} className="mb-2">
              Welcome back, {user?.user.firstName}!
            </Text>
            <Text size="sm" className="opacity-90">
              Here's an overview of your partner dashboard
            </Text>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-500 delay-100">
            {isLoading ? (
              <>
                <Skeleton height={140} radius="xl" />
                <Skeleton height={140} radius="xl" />
              </>
            ) : (
              stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <Paper
                    key={stat.label}
                    p="lg"
                    withBorder
                    className={cn(
                      "rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-[1.02] cursor-default",
                      "animate-in slide-in-from-bottom-4 duration-500"
                    )}
                    style={{ animationDelay: `${150 + index * 100}ms` }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="space-y-2 flex-1">
                        <Text size="sm" c="dimmed" className="uppercase tracking-wide font-medium">
                          {stat.label}
                        </Text>
                        <Text size="32px" fw={700} className="text-gray-900 leading-none">
                          {stat.value.toLocaleString()}
                        </Text>
                        <Text size="xs" c="dimmed">
                          {stat.description}
                        </Text>
                      </div>
                      <div
                        className={cn(
                          "p-4 rounded-xl transition-transform duration-300 hover:scale-110",
                          colorClasses[stat.color as keyof typeof colorClasses]
                        )}
                      >
                        <Icon size={28} strokeWidth={2} />
                      </div>
                    </div>
                  </Paper>
                );
              })
            )}
          </div>

          {/* Payout Status */}
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 delay-300">
            {isLoading || !data ? (
              <Skeleton width="100%" height={100} radius="xl" />
            ) : (
              <PayoutStatusBanner status={data.payoutEligibility} />
            )}
          </div>
        </>
      )}
    </div>
  );
}
