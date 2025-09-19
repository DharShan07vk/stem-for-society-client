import { createTheme, MantineProvider } from "@mantine/core";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { NuqsAdapter } from "nuqs/adapters/react";
import { Outlet, Route, Routes } from "react-router-dom";
import { Slide, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ErrorBoundary from "./components/ErrorBoundary";
import AdminApplicationsLayout from "./layouts/AdminApplicationsLayout";
import AdminLayout from "./layouts/AdminLayout";
import PartnerLayout from "./layouts/PartnerLayout";
import PartnerSettingsLayout from "./layouts/PartnerSettingsLayout";
import { queryClient } from "./lib/api";
import { NotFound } from "./pages/404/NotFound";
import AdminBlogs from "./pages/admin/AdminBlogs";
import AdminBlogSpotlight from "./pages/admin/AdminBlogSpotlight";
import AdminCampusAmbassador from "./pages/admin/AdminCampusAmbassador";
import AdminHome from "./pages/admin/AdminHome";
import AdminInstitutionRegistrations from "./pages/admin/AdminInstitutionPlan";
import AdminPartners from "./pages/admin/AdminParnters";
import AdminPartnerDetails from "./pages/admin/AdminPartnerDetails";
import AdminPsychology from "./pages/admin/AdminPsychology";
import AdminSchedules from "./pages/admin/AdminSchedules";
import AdminSignIn from "./pages/admin/AdminSignIn";
import AdminStudentDetails from "./pages/admin/AdminStudentDetails";
import AdminStudents from "./pages/admin/AdminStudents";
import AdminTrainings from "./pages/admin/AdminTrainings";
import AdminTrainingSpotlight from "./pages/admin/AdminTrainingSpotlight";
import AdminTransactions from "./pages/admin/AdminTransactions";
import BlogCreate from "./pages/BlogCreate";
import BlogListing from "./pages/BlogListing";
import BlogSpotlight from "./pages/BlogSpotlight";
import CampusAmbassador from "./pages/CampusAmbassador";
import Home from "./pages/home";
import Login from "./pages/Login";
import PartnerAccounts from "./pages/partner/PartnerAccount";
import PartnerCourseDetails from "./pages/partner/PartnerCourseDetails";
import PartnerCreateCourse from "./pages/partner/PartnerCreateCourse";
import PartnerHome from "./pages/partner/PartnerHome";
import PartnerSettings from "./pages/partner/PartnerSettings";
import PartnerSignIn from "./pages/partner/PartnerSignIn";
import PartnerStudents from "./pages/partner/PartnerStudents";
import PartnerTrainings from "./pages/partner/PartnerTrainings";
import PartnerSignUp from "./pages/partner/PartnerWithUs";
import StudentDetails from "./pages/partner/StudentDetails";
// import PricingPage from "./pages/Pricing";
import ForgotPassword from "./pages/forgotPassword"
import PrivacyPolicy from "./pages/PrivacyPolicy";
import PsychologyTraining from "./pages/PsychologyTraining";
import RefundPolicy from "./pages/RefundPolicy";
import SignUp from "./pages/Signup";
import Training from "./pages/Training";
import TrainingSpotlight from "./pages/TrainingSpotlight";
import JoinCommunity from "./pages/JoinCommunity";
import CareerCounselling from "./pages/CareerCounselling";
import AdminCareerCounselling from "./pages/admin/AdminCareerCounselling";
import ExploreProgramDashboard from "./pages/ExploreProgramDashboard";
import PsychologyCounselling from "./pages/PsychologyCounselling";
import InstitutionPricing from "./pages/InstitutionPricing";
import CampusAmbassadorDash from "./pages/CampusAmbassadorDash";
import CampusAmbassadorBooking from "./pages/CampusAmbassadorBooking";
import PartnerRole from "./pages/PartnerRole";
import CampusAmbassadorSignup from "./pages/CampusAmbassadorSignup";
import InstitutionPortal from './pages/PartnerInstitutionPortal';
import InstitutionLogin from "./pages/InstitutionLogin";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import Community from "./pages/Community";
import Blog from "./pages/Blog";
import BlogArticle from "./pages/BlogArticle";
import BlogPost from "./pages/BlogPost";
import CareerCounsellingBookingFlow from "./pages/CareerCounsellingBookingFlow";
import PsychologyBookingFlow from "./pages/PsychologyBookingFlow";
import InstitutionBookingFlow from "./pages/InstitutionBookingFlow";
function AppLayout() {
  return (
    <>
      <div className="min-h-screen flex flex-col">
        <Outlet />
      </div>
    </>
  );
}

const theme = createTheme({
  fontFamily:
    "apple-system, BlinkMacSystemFont, Inter, Verdana, Segoe UI, Roboto, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji",
  fontFamilyMonospace: "Monaco, Courier, monospace",
  headings: { fontFamily: "Greycliff CF, sans-serif" },
});

function App() {
  return (
    <ErrorBoundary>
      <NuqsAdapter>
        <QueryClientProvider client={queryClient}>
          <MantineProvider theme={theme}>
            <Routes>
              <Route path="/" element={<AppLayout />}>
                <Route index element={<Home />} />
                <Route path="/explore-program-dashboard" element={<ExploreProgramDashboard />} />
                <Route path="/training" element={<Training />} />
                <Route path="/training/:id" element={<TrainingSpotlight />} />
                <Route path="/blogs" element={<BlogListing />} />
                <Route path="/blogs/:id" element={<BlogSpotlight />} />
                {/* <Route path="/pricing" element={<Home />} /> */}
                <Route path="/community" element={<Community />} />
                {/* <Route path="/blogs/new" element={<BlogCreate />} /> */}
                <Route path="/login" element={<Login />} />
                {/* <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/refund-policy" element={<RefundPolicy />} /> */}
                <Route path="/join-community" element={<JoinCommunity />} />
                <Route path="/partner-role" element={<PartnerRole />} />
                <Route path="/campus-ambassador-signup" element={<CampusAmbassadorSignup />} />
                <Route path="/partner-institution-signup" element={<InstitutionPortal />} />
                <Route path="/partner-signin" element={<InstitutionLogin />} />
                <Route path="/courses" element={<Courses />} />
                <Route path="/course-detail/:id" element={<CourseDetail />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog-article" element={<BlogArticle />} />
                <Route path="/blog-post/:id" element={<BlogPost />} />
                <Route path="/career-counselling-booking" element={<CareerCounsellingBookingFlow/>} />
                <Route path="/mental-wellbeing" element={<PsychologyCounselling />} />
                <Route path="/career-counselling" element={<CareerCounselling />} />
                <Route path="/mental-wellbeing-counselling" element={<PsychologyBookingFlow />} />
                <Route path="/institution-booking" element={<InstitutionBookingFlow />} />
                <Route path = "/forgot-password" element = {<ForgotPassword />} />
                <Route
                  path="/institution-pricing"
                  element={<InstitutionPricing />}
                />
                <Route path="/campus-ambassador-booking" element={<CampusAmbassadorBooking/>} />
                <Route path="/campus-ambassador" element={<CampusAmbassadorDash />} />
                <Route path="/ca-program" element={<CampusAmbassador />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="*" element={<NotFound />} />
              </Route>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminHome />} />
                <Route path="signin" element={<AdminSignIn />} />
                <Route path="trainings" element={<AdminTrainings />} />
                <Route
                  path="trainings/:id"
                  element={<AdminTrainingSpotlight />}
                />
                <Route path="blogs" element={<AdminBlogs />} />
                <Route path="blogs/:id" element={<AdminBlogSpotlight />} />
                <Route path="partners" element={<AdminPartners />} />
                <Route path="partners/:id" element={<AdminPartnerDetails />} />
                <Route path="transactions" element={<AdminTransactions />} />
                <Route path="schedules" element={<AdminSchedules />} />
                <Route path="students" element={<AdminStudents />} />
                <Route path="students/:id" element={<AdminStudentDetails />} />
                <Route
                  path="applications"
                  element={<AdminApplicationsLayout />}
                >
                  <Route index element={<AdminPsychology />} />
                  <Route
                    path="career-counselling"
                    element={<AdminCareerCounselling />}
                  />
                  <Route
                    path="ca-programs"
                    element={<AdminCampusAmbassador />}
                  />
                  <Route
                    path="institutions"
                    element={<AdminInstitutionRegistrations />}
                  />
                </Route>
              </Route>
              <Route path="/partner" element={<PartnerLayout />}>
                <Route index element={<PartnerHome />} />
                <Route path="signin" element={<PartnerSignIn />} />
                <Route path="signup" element={<PartnerSignUp />} />
                <Route path="create" element={<PartnerCreateCourse />} />
                <Route path="trainings" element={<PartnerTrainings />} />
                <Route
                  path="trainings/:id"
                  element={<PartnerCourseDetails />}
                />
                <Route path="students" element={<PartnerStudents />} />
                <Route path="students/:id" element={<StudentDetails />} />
                <Route path="settings" element={<PartnerSettingsLayout />}>
                  <Route index element={<PartnerSettings />} />
                  <Route path="account" element={<PartnerAccounts />} />
                </Route>
              </Route>
            </Routes>
          </MantineProvider>
          <ToastContainer
            transition={Slide}
            hideProgressBar
            autoClose={6000}
            position="bottom-right"
          />
          <ReactQueryDevtools />
        </QueryClientProvider>
      </NuqsAdapter>
    </ErrorBoundary>
  );
}

export default App;
