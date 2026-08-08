
import React, { useEffect, useMemo, useState } from "react";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

// Change these if your router uses different paths.
const BLOOD_REQUEST_API = `${API_BASE_URL}/blood-requests`;
const HOSPITAL_API = `${API_BASE_URL}/hospitals`;

const BLOOD_GROUPS = [
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-",
];

const URGENCIES = [
  {
    value: "Low",
    label: "Low",
    description: "Can wait",
    color: "emerald",
  },
  {
    value: "Medium",
    label: "Medium",
    description: "Needed soon",
    color: "amber",
  },
  {
    value: "High",
    label: "High",
    description: "Needs attention",
    color: "orange",
  },
  {
    value: "Critical",
    label: "Critical",
    description: "Immediate need",
    color: "red",
  },
];

const EMPTY_FORM = {
  patientName: "",
  bloodGroup: "",
  unitsRequired: 1,
  hospital: "",
  city: "",
  address: "",
  urgency: "Medium",
  requiredBy: "",
  contactName: "",
  contactPhone: "",
  additionalNotes: "",
};

const BloodRequest = () => {
  const [activeTab, setActiveTab] = useState("create");

  const [form, setForm] = useState(EMPTY_FORM);

  const [requests, setRequests] = useState([]);

  const [hospitals, setHospitals] = useState([]);

  const [loadingRequests, setLoadingRequests] =
    useState(false);

  const [loadingHospitals, setLoadingHospitals] =
    useState(false);

  const [submitting, setSubmitting] =
    useState(false);

  const [selectedRequest, setSelectedRequest] =
    useState(null);

  const [loadingDetails, setLoadingDetails] =
    useState(false);

  const [cancellingId, setCancellingId] =
    useState(null);

  const [successMessage, setSuccessMessage] =
    useState("");

  const [errorMessage, setErrorMessage] =
    useState("");

  const [fieldErrors, setFieldErrors] =
    useState({});

  // =====================================================
  // AUTH
  // =====================================================

  const getToken = () => {
    return (
      localStorage.getItem("token") ||
      sessionStorage.getItem("token")
    );
  };

  // =====================================================
  // API HELPER
  // =====================================================

  const apiRequest = async (
    url,
    options = {}
  ) => {
    const token = getToken();

    const response = await fetch(url, {
      ...options,

      headers: {
        "Content-Type": "application/json",

        ...(token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {}),

        ...(options.headers || {}),
      },
    });

    let data = null;

    try {
      data = await response.json();
    } catch {
      data = null;
    }

    if (!response.ok) {
      throw new Error(
        data?.message ||
          "Something went wrong. Please try again."
      );
    }

    return data;
  };

  // =====================================================
  // LOAD HOSPITALS
  // =====================================================

  useEffect(() => {
    loadHospitals();
  }, []);

  const loadHospitals = async () => {
    setLoadingHospitals(true);

    try {
      const data = await apiRequest(
        HOSPITAL_API
      );

      const hospitalList =
        data?.hospitals ||
        data?.data ||
        [];

      setHospitals(
        Array.isArray(hospitalList)
          ? hospitalList
          : []
      );
    } catch (error) {
      console.error(
        "Hospital loading error:",
        error
      );

      // Hospital API may not exist yet.
      // The form still remains usable.
      setHospitals([]);
    } finally {
      setLoadingHospitals(false);
    }
  };

  // =====================================================
  // LOAD MY REQUESTS
  // =====================================================

  useEffect(() => {
    if (activeTab === "requests") {
      loadMyRequests();
    }
  }, [activeTab]);

  const loadMyRequests = async () => {
    setLoadingRequests(true);
    setErrorMessage("");

    try {
      const data = await apiRequest(
        BLOOD_REQUEST_API
      );

      setRequests(
        Array.isArray(data?.requests)
          ? data.requests
          : []
      );
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoadingRequests(false);
    }
  };

  // =====================================================
  // FORM HANDLER
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (fieldErrors[name]) {
      setFieldErrors((previous) => ({
        ...previous,
        [name]: "",
      }));
    }

    setErrorMessage("");
  };

  // =====================================================
  // HOSPITAL CHANGE
  // =====================================================

  const handleHospitalChange = (e) => {
    const hospitalId = e.target.value;

    const hospital = hospitals.find(
      (item) =>
        String(item._id) === String(hospitalId)
    );

    setForm((previous) => ({
      ...previous,
      hospital: hospitalId,
      city:
        hospital?.city ||
        previous.city,
      address:
        hospital?.address ||
        previous.address,
    }));

    setFieldErrors((previous) => ({
      ...previous,
      hospital: "",
    }));
  };

  // =====================================================
  // VALIDATION
  // =====================================================

  const validateForm = () => {
    const errors = {};

    if (!form.patientName.trim()) {
      errors.patientName =
        "Patient name is required.";
    }

    if (!form.bloodGroup) {
      errors.bloodGroup =
        "Select a blood group.";
    }

    if (
      !form.unitsRequired ||
      Number(form.unitsRequired) < 1
    ) {
      errors.unitsRequired =
        "At least 1 unit is required.";
    }

    if (!Number.isInteger(
      Number(form.unitsRequired)
    )) {
      errors.unitsRequired =
        "Units must be a whole number.";
    }

    if (!form.hospital) {
      errors.hospital =
        "Please select a hospital.";
    }

    if (!form.city.trim()) {
      errors.city =
        "City is required.";
    }

    if (!form.address.trim()) {
      errors.address =
        "Address is required.";
    }

    if (!form.requiredBy) {
      errors.requiredBy =
        "Required-by date is required.";
    }

    if (!form.contactName.trim()) {
      errors.contactName =
        "Contact name is required.";
    }

    if (!form.contactPhone.trim()) {
      errors.contactPhone =
        "Contact phone is required.";
    }

    if (
      form.contactPhone &&
      !/^[0-9+\-\s()]{7,20}$/.test(
        form.contactPhone
      )
    ) {
      errors.contactPhone =
        "Enter a valid phone number.";
    }

    setFieldErrors(errors);

    return Object.keys(errors).length === 0;
  };

  // =====================================================
  // CREATE REQUEST
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSuccessMessage("");
    setErrorMessage("");

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        patientName:
          form.patientName.trim(),

        bloodGroup:
          form.bloodGroup,

        unitsRequired:
          Number(form.unitsRequired),

        hospital:
          form.hospital,

        city:
          form.city.trim(),

        address:
          form.address.trim(),

        urgency:
          form.urgency,

        requiredBy:
          new Date(
            form.requiredBy
          ).toISOString(),

        contactName:
          form.contactName.trim(),

        contactPhone:
          form.contactPhone.trim(),

        additionalNotes:
          form.additionalNotes.trim() ||
          undefined,
      };

      const data = await apiRequest(
        BLOOD_REQUEST_API,
        {
          method: "POST",
          body: JSON.stringify(payload),
        }
      );

      setSuccessMessage(
        data?.message ||
          "Blood request created successfully."
      );

      setForm(EMPTY_FORM);
      setFieldErrors({});

      // Refresh requests
      await loadMyRequests();

      // Show created request
      if (data?.request) {
        setSelectedRequest(
          data.request
        );
      }

      setActiveTab("requests");

    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  // =====================================================
  // GET SINGLE REQUEST
  // =====================================================

  const openRequest = async (id) => {
    setLoadingDetails(true);
    setErrorMessage("");

    try {
      const data =
        await apiRequest(
          `${BLOOD_REQUEST_API}/${id}`
        );

      setSelectedRequest(
        data?.request || null
      );
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoadingDetails(false);
    }
  };

  // =====================================================
  // CANCEL REQUEST
  // =====================================================

  const cancelRequest = async (id) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to cancel this blood request?"
      );

    if (!confirmed) {
      return;
    }

    setCancellingId(id);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const data =
        await apiRequest(
          `${BLOOD_REQUEST_API}/${id}/cancel`,
          {
            method: "PATCH",
          }
        );

      setSuccessMessage(
        data?.message ||
          "Blood request cancelled successfully."
      );

      await loadMyRequests();

      if (
        selectedRequest?._id === id
      ) {
        setSelectedRequest(
          data?.request ||
            selectedRequest
        );
      }

    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setCancellingId(null);
    }
  };

  // =====================================================
  // STATISTICS
  // =====================================================

  const stats = useMemo(() => {
    const open =
      requests.filter(
        (item) =>
          item.status === "Open"
      ).length;

    const completed =
      requests.filter(
        (item) =>
          item.status === "Completed"
      ).length;

    const cancelled =
      requests.filter(
        (item) =>
          item.status === "Cancelled"
      ).length;

    const totalUnits =
      requests.reduce(
        (sum, item) =>
          sum +
          Number(
            item.unitsRequired || 0
          ),
        0
      );

    return {
      open,
      completed,
      cancelled,
      totalUnits,
    };
  }, [requests]);

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="min-h-screen bg-[#f6f9fc]">

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="h-20 flex items-center justify-between">

            <div className="flex items-center gap-3">

              <div className="w-11 h-11 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">

                <BloodDropIcon />

              </div>

              <div>

                <h1 className="text-lg sm:text-xl font-black tracking-tight text-slate-900">
                  Blood Support
                </h1>

                <p className="text-xs text-slate-400">
                  Request blood when you need it
                </p>

              </div>

            </div>


            <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-50 text-emerald-700">

              <span className="w-2 h-2 rounded-full bg-emerald-500" />

              <span className="text-xs font-semibold">
                Sahara Blood Network
              </span>

            </div>

          </div>

        </div>

      </header>


      {/* =================================================
          MAIN
      ================================================= */}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7 sm:py-10">

        {/* =================================================
            PAGE INTRO
        ================================================= */}

        <div className="mb-7">

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">

            <div>

              <p className="text-xs font-bold tracking-[0.18em] text-red-600 uppercase">
                BLOOD ASSISTANCE
              </p>

              <h2 className="text-3xl sm:text-4xl font-black tracking-[-0.045em] text-slate-950 mt-2">
                Help starts with a request.
              </h2>

              <p className="text-sm sm:text-base text-slate-500 max-w-2xl leading-7 mt-3">
                Create a blood request and keep track of
                its status through your Sahara account.
              </p>

            </div>


            {/* Stats */}

            {requests.length > 0 && (

              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">

                <StatCard
                  label="Open"
                  value={stats.open}
                  color="red"
                />

                <StatCard
                  label="Completed"
                  value={stats.completed}
                  color="emerald"
                />

                <StatCard
                  label="Cancelled"
                  value={stats.cancelled}
                  color="slate"
                />

                <StatCard
                  label="Units"
                  value={stats.totalUnits}
                  color="blue"
                  className="hidden sm:block"
                />

              </div>

            )}

          </div>

        </div>


        {/* =================================================
            ALERTS
        ================================================= */}

        {successMessage && (

          <Alert
            type="success"
            message={successMessage}
            onClose={() =>
              setSuccessMessage("")
            }
          />

        )}

        {errorMessage && (

          <Alert
            type="error"
            message={errorMessage}
            onClose={() =>
              setErrorMessage("")
            }
          />

        )}


        {/* =================================================
            TABS
        ================================================= */}

        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl w-fit mb-6">

          <TabButton
            active={
              activeTab === "create"
            }
            onClick={() =>
              setActiveTab("create")
            }
          >
            + New Request
          </TabButton>

          <TabButton
            active={
              activeTab === "requests"
            }
            onClick={() =>
              setActiveTab("requests")
            }
          >
            My Requests
            {requests.length > 0 && (
              <span className="ml-2 px-1.5 py-0.5 rounded-md bg-white text-slate-500 text-[10px]">
                {requests.length}
              </span>
            )}
          </TabButton>

        </div>


        {/* =================================================
            CREATE
        ================================================= */}

        {activeTab === "create" && (

          <CreateRequestForm
            form={form}
            fieldErrors={fieldErrors}
            hospitals={hospitals}
            loadingHospitals={
              loadingHospitals
            }
            submitting={submitting}
            onChange={handleChange}
            onHospitalChange={
              handleHospitalChange
            }
            onSubmit={handleSubmit}
            onCancel={() => {
              setForm(EMPTY_FORM);
              setFieldErrors({});
              setErrorMessage("");
            }}
          />

        )}


        {/* =================================================
            REQUESTS
        ================================================= */}

        {activeTab === "requests" && (

          <RequestsList
            requests={requests}
            loading={loadingRequests}
            cancellingId={cancellingId}
            onOpen={openRequest}
            onCancel={cancelRequest}
            onCreate={() =>
              setActiveTab("create")
            }
          />

        )}

      </main>


      {/* =================================================
          DETAIL MODAL
      ================================================= */}

      {(selectedRequest ||
        loadingDetails) && (

        <RequestModal
          request={selectedRequest}
          loading={loadingDetails}
          cancellingId={cancellingId}
          onClose={() =>
            setSelectedRequest(null)
          }
          onCancel={cancelRequest}
        />

      )}

    </div>
  );
};


// =========================================================
// CREATE FORM
// =========================================================

const CreateRequestForm = ({
  form,
  fieldErrors,
  hospitals,
  loadingHospitals,
  submitting,
  onChange,
  onHospitalChange,
  onSubmit,
  onCancel,
}) => {

  return (
    <form
      onSubmit={onSubmit}
      className="grid lg:grid-cols-[1fr_340px] gap-6"
    >

      {/* ===================================================
          FORM
      =================================================== */}

      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden">

        {/* Header */}

        <div className="px-5 sm:px-7 py-5 border-b border-slate-100">

          <h3 className="font-bold text-slate-900">
            Blood request details
          </h3>

          <p className="text-xs text-slate-400 mt-1">
            Provide accurate information so the request
            can be processed correctly.
          </p>

        </div>


        <div className="p-5 sm:p-7 space-y-8">

          {/* =================================================
              PATIENT
          ================================================= */}

          <FormSection
            number="01"
            title="Patient information"
            description="Who needs the blood?"
          >

            <div className="grid sm:grid-cols-2 gap-5">

              <InputField
                label="Patient name"
                name="patientName"
                value={form.patientName}
                onChange={onChange}
                placeholder="Enter patient's full name"
                required
                error={
                  fieldErrors.patientName
                }
              />

              <SelectField
                label="Blood group"
                name="bloodGroup"
                value={form.bloodGroup}
                onChange={onChange}
                options={BLOOD_GROUPS.map(
                  (group) => ({
                    value: group,
                    label: group,
                  })
                )}
                placeholder="Select blood group"
                required
                error={
                  fieldErrors.bloodGroup
                }
              />

            </div>


            <div className="mt-5 max-w-xs">

              <InputField
                label="Units required"
                name="unitsRequired"
                type="number"
                min="1"
                step="1"
                value={form.unitsRequired}
                onChange={onChange}
                placeholder="1"
                required
                error={
                  fieldErrors.unitsRequired
                }
              />

            </div>

          </FormSection>


          {/* =================================================
              HOSPITAL
          ================================================= */}

          <FormSection
            number="02"
            title="Hospital information"
            description="Where should the blood be delivered?"
          >

            <SelectField
              label="Hospital"
              name="hospital"
              value={form.hospital}
              onChange={onHospitalChange}
              options={hospitals.map(
                (hospital) => ({
                  value: hospital._id,
                  label:
                    hospital.name ||
                    hospital.hospitalName ||
                    "Hospital",
                })
              )}
              placeholder={
                loadingHospitals
                  ? "Loading hospitals..."
                  : hospitals.length
                  ? "Select hospital"
                  : "No hospitals available"
              }
              required
              disabled={
                loadingHospitals ||
                hospitals.length === 0
              }
              error={
                fieldErrors.hospital
              }
            />

            {hospitals.length === 0 &&
              !loadingHospitals && (

                <div className="mt-3 rounded-xl bg-amber-50 border border-amber-100 p-3">

                  <div className="flex gap-2">

                    <span className="text-amber-600">
                      ⚠
                    </span>

                    <p className="text-xs text-amber-700 leading-5">
                      No hospitals were returned by
                      your hospital API. Make sure your
                      GET hospital endpoint is available.
                    </p>

                  </div>

                </div>

              )}


            <div className="grid sm:grid-cols-2 gap-5 mt-5">

              <InputField
                label="City"
                name="city"
                value={form.city}
                onChange={onChange}
                placeholder="Hospital city"
                required
                error={fieldErrors.city}
              />

              <InputField
                label="Address"
                name="address"
                value={form.address}
                onChange={onChange}
                placeholder="Hospital address"
                required
                error={
                  fieldErrors.address
                }
              />

            </div>

          </FormSection>


          {/* =================================================
              URGENCY
          ================================================= */}

          <FormSection
            number="03"
            title="Urgency"
            description="How urgently is blood required?"
          >

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">

              {URGENCIES.map(
                (urgency) => (

                  <UrgencyOption
                    key={urgency.value}
                    urgency={urgency}
                    selected={
                      form.urgency ===
                      urgency.value
                    }
                    onClick={() =>
                      onChange({
                        target: {
                          name: "urgency",
                          value:
                            urgency.value,
                        },
                      })
                    }
                  />

                )
              )}

            </div>

          </FormSection>


          {/* =================================================
              DATE
          ================================================= */}

          <FormSection
            number="04"
            title="Required by"
            description="When is the blood needed?"
          >

            <div className="max-w-sm">

              <InputField
                label="Required-by date and time"
                name="requiredBy"
                type="datetime-local"
                value={form.requiredBy}
                onChange={onChange}
                required
                error={
                  fieldErrors.requiredBy
                }
              />

            </div>

          </FormSection>


          {/* =================================================
              CONTACT
          ================================================= */}

          <FormSection
            number="05"
            title="Emergency contact"
            description="Who should donors or healthcare staff contact?"
          >

            <div className="grid sm:grid-cols-2 gap-5">

              <InputField
                label="Contact name"
                name="contactName"
                value={form.contactName}
                onChange={onChange}
                placeholder="Full name"
                required
                error={
                  fieldErrors.contactName
                }
              />

              <InputField
                label="Contact phone"
                name="contactPhone"
                type="tel"
                value={form.contactPhone}
                onChange={onChange}
                placeholder="+977 98XXXXXXXX"
                required
                error={
                  fieldErrors.contactPhone
                }
              />

            </div>

          </FormSection>


          {/* =================================================
              NOTES
          ================================================= */}

          <FormSection
            number="06"
            title="Additional information"
            description="Anything else donors or healthcare staff should know?"
          >

            <textarea
              name="additionalNotes"
              value={form.additionalNotes}
              onChange={onChange}
              rows="4"
              maxLength="1000"
              placeholder="Add any relevant information..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 outline-none resize-none focus:bg-white focus:border-red-400 focus:ring-4 focus:ring-red-500/10 transition"
            />

            <p className="text-[10px] text-slate-400 mt-1 text-right">
              {form.additionalNotes.length}/1000
            </p>

          </FormSection>

        </div>


        {/* =================================================
            FORM FOOTER
        ================================================= */}

        <div className="px-5 sm:px-7 py-5 bg-slate-50 border-t border-slate-100 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">

          <button
            type="button"
            onClick={onCancel}
            disabled={submitting}
            className="px-5 py-3 rounded-xl border border-slate-200 bg-white text-slate-600 text-sm font-semibold hover:bg-slate-50 disabled:opacity-50 transition"
          >
            Clear form
          </button>

          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-bold shadow-lg shadow-red-600/15 disabled:opacity-60 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
          >

            {submitting ? (
              <>
                <Spinner />
                Creating request...
              </>
            ) : (
              <>
                <BloodDropIcon />
                Create blood request
              </>
            )}

          </button>

        </div>

      </div>


      {/* ===================================================
          SIDEBAR
      =================================================== */}

      <aside className="space-y-5">

        <div className="bg-[#071f3d] rounded-3xl p-6 text-white">

          <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center mb-5">
            <HeartPulseIcon />
          </div>

          <h3 className="text-lg font-bold">
            You're helping someone get closer to care.
          </h3>

          <p className="text-xs text-slate-300 leading-5 mt-3">
            Accurate blood request information helps
            Sahara connect requests with the right
            healthcare resources.
          </p>

        </div>


        <div className="bg-white border border-slate-200 rounded-3xl p-5">

          <h3 className="text-sm font-bold text-slate-900">
            Before submitting
          </h3>

          <div className="mt-4 space-y-3">

            <ChecklistItem text="Verify the patient's blood group" />
            <ChecklistItem text="Use a reachable contact number" />
            <ChecklistItem text="Select the correct hospital" />
            <ChecklistItem text="Choose the correct urgency" />
            <ChecklistItem text="Check the required-by date" />

          </div>

        </div>


        <div className="bg-red-50 border border-red-100 rounded-3xl p-5">

          <div className="flex gap-3">

            <div className="w-9 h-9 rounded-xl bg-white text-red-600 flex items-center justify-center shrink-0">
              <AlertIcon />
            </div>

            <div>

              <h3 className="text-sm font-bold text-red-900">
                Emergency?
              </h3>

              <p className="text-xs text-red-700 leading-5 mt-1">
                If this is a life-threatening emergency,
                use Sahara Emergency SOS instead of
                waiting for a blood request response.
              </p>

            </div>

          </div>

        </div>

      </aside>

    </form>
  );
};


// =========================================================
// REQUEST LIST
// =========================================================

const RequestsList = ({
  requests,
  loading,
  cancellingId,
  onOpen,
  onCancel,
  onCreate,
}) => {

  if (loading) {
    return (
      <div className="bg-white border border-slate-200 rounded-3xl p-10">

        <div className="flex flex-col items-center justify-center">

          <Spinner dark />

          <p className="text-sm font-medium text-slate-600 mt-4">
            Loading your blood requests...
          </p>

        </div>

      </div>
    );
  }


  if (requests.length === 0) {

    return (
      <div className="bg-white border border-slate-200 rounded-3xl py-16 px-6 text-center">

        <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mx-auto">

          <BloodDropIcon size={28} />

        </div>

        <h3 className="text-xl font-bold text-slate-900 mt-5">
          No blood requests yet
        </h3>

        <p className="text-sm text-slate-500 max-w-md mx-auto leading-6 mt-2">
          When you create a blood request, you'll be
          able to track its status and details here.
        </p>

        <button
          type="button"
          onClick={onCreate}
          className="mt-6 px-5 py-3 rounded-xl bg-red-600 text-white text-sm font-bold hover:bg-red-700 transition"
        >
          Create your first request
        </button>

      </div>
    );
  }


  return (
    <div className="space-y-4">

      {requests.map((request) => (

        <RequestCard
          key={request._id}
          request={request}
          cancellingId={cancellingId}
          onOpen={onOpen}
          onCancel={onCancel}
        />

      ))}

    </div>
  );
};


// =========================================================
// REQUEST CARD
// =========================================================

const RequestCard = ({
  request,
  cancellingId,
  onOpen,
  onCancel,
}) => {

  const urgency =
    getUrgencyConfig(
      request.urgency
    );

  const status =
    getStatusConfig(
      request.status
    );

  const hospital =
    request.hospital;

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-900/5 transition">

      <div className="flex flex-col lg:flex-row lg:items-center gap-5">

        {/* Blood */}

        <div className="flex items-center gap-4 flex-1">

          <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">

            <span className="text-xl font-black">
              {request.bloodGroup}
            </span>

          </div>


          <div className="min-w-0">

            <div className="flex flex-wrap items-center gap-2">

              <h3 className="font-bold text-slate-900">
                {request.patientName}
              </h3>

              <StatusBadge
                config={status}
              />

            </div>

            <p className="text-xs text-slate-500 mt-1">
              {request.unitsRequired}{" "}
              {request.unitsRequired === 1
                ? "unit"
                : "units"}{" "}
              • {request.bloodGroup}
            </p>

          </div>

        </div>


        {/* Details */}

        <div className="grid sm:grid-cols-3 gap-4 lg:w-[500px]">

          <InfoItem
            icon="🏥"
            label="Hospital"
            value={
              hospital?.name ||
              hospital?.hospitalName ||
              "Hospital"
            }
          />

          <InfoItem
            icon="📍"
            label="City"
            value={
              request.city ||
              hospital?.city ||
              "—"
            }
          />

          <InfoItem
            icon="📅"
            label="Required by"
            value={formatDate(
              request.requiredBy
            )}
          />

        </div>


        {/* Actions */}

        <div className="flex flex-wrap items-center gap-2 lg:w-auto">

          <span
            className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold ${urgency.badge}`}
          >
            {request.urgency}
          </span>

          <button
            type="button"
            onClick={() =>
              onOpen(request._id)
            }
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
          >
            View
          </button>

          {request.status === "Open" && (

            <button
              type="button"
              disabled={
                cancellingId ===
                request._id
              }
              onClick={() =>
                onCancel(request._id)
              }
              className="px-3 py-2 rounded-xl border border-red-100 bg-red-50 text-red-600 text-xs font-semibold hover:bg-red-100 disabled:opacity-50 transition"
            >
              {cancellingId ===
              request._id
                ? "Cancelling..."
                : "Cancel"}
            </button>

          )}

        </div>

      </div>

    </div>
  );
};


// =========================================================
// REQUEST MODAL
// =========================================================

const RequestModal = ({
  request,
  loading,
  cancellingId,
  onClose,
  onCancel,
}) => {

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">

      <div
        className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
        onClick={onClose}
      />


      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl">

        {/* Header */}

        <div className="sticky top-0 z-10 bg-white border-b border-slate-100 px-5 sm:px-7 py-5 flex items-center justify-between">

          <div>

            <p className="text-xs font-bold uppercase tracking-wider text-red-600">
              Blood request
            </p>

            <h2 className="text-xl font-black text-slate-900 mt-1">
              Request details
            </h2>

          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center transition"
          >
            ×
          </button>

        </div>


        {loading ? (

          <div className="p-14 flex flex-col items-center">

            <Spinner dark />

            <p className="text-sm text-slate-500 mt-4">
              Loading request...
            </p>

          </div>

        ) : request ? (

          <div className="p-5 sm:p-7">

            {/* Summary */}

            <div className="rounded-2xl bg-red-50 border border-red-100 p-5">

              <div className="flex items-center gap-4">

                <div className="w-16 h-16 rounded-2xl bg-white text-red-600 flex items-center justify-center shadow-sm">

                  <span className="text-xl font-black">
                    {request.bloodGroup}
                  </span>

                </div>

                <div>

                  <h3 className="text-lg font-black text-slate-900">
                    {request.patientName}
                  </h3>

                  <p className="text-sm text-slate-500 mt-1">
                    {request.unitsRequired}{" "}
                    {request.unitsRequired === 1
                      ? "unit"
                      : "units"}{" "}
                    required
                  </p>

                </div>

              </div>

            </div>


            {/* Status */}

            <div className="grid sm:grid-cols-2 gap-3 mt-5">

              <DetailBox
                label="Request status"
                value={
                  request.status ||
                  "Open"
                }
              />

              <DetailBox
                label="Urgency"
                value={
                  request.urgency ||
                  "Medium"
                }
              />

              <DetailBox
                label="Required by"
                value={formatDate(
                  request.requiredBy,
                  true
                )}
              />

              <DetailBox
                label="Created"
                value={formatDate(
                  request.createdAt,
                  true
                )}
              />

            </div>


            {/* Hospital */}

            <DetailSection title="Hospital">

              <div className="grid sm:grid-cols-2 gap-4">

                <DetailBox
                  label="Hospital"
                  value={
                    request.hospital
                      ?.name ||
                    request.hospital
                      ?.hospitalName ||
                    "—"
                  }
                />

                <DetailBox
                  label="City"
                  value={
                    request.city ||
                    request.hospital?.city ||
                    "—"
                  }
                />

                <DetailBox
                  label="Address"
                  value={
                    request.address ||
                    request.hospital?.address ||
                    "—"
                  }
                />

              </div>

            </DetailSection>


            {/* Contact */}

            <DetailSection title="Emergency contact">

              <div className="grid sm:grid-cols-2 gap-4">

                <DetailBox
                  label="Name"
                  value={
                    request.contactName ||
                    "—"
                  }
                />

                <DetailBox
                  label="Phone"
                  value={
                    request.contactPhone ||
                    "—"
                  }
                />

              </div>

            </DetailSection>


            {/* Notes */}

            {request.additionalNotes && (

              <DetailSection title="Additional notes">

                <div className="rounded-xl bg-slate-50 border border-slate-100 p-4">

                  <p className="text-sm leading-6 text-slate-600 whitespace-pre-wrap">
                    {request.additionalNotes}
                  </p>

                </div>

              </DetailSection>

            )}


            {/* Requested by */}

            {request.requestedBy && (

              <DetailSection title="Requested by">

                <div className="rounded-xl bg-slate-50 border border-slate-100 p-4">

                  <p className="text-sm font-semibold text-slate-800">
                    {request.requestedBy.fullName ||
                      "User"}
                  </p>

                  {request.requestedBy.email && (

                    <p className="text-xs text-slate-500 mt-1">
                      {request.requestedBy.email}
                    </p>

                  )}

                  {request.requestedBy.phone && (

                    <p className="text-xs text-slate-500 mt-1">
                      {request.requestedBy.phone}
                    </p>

                  )}

                </div>

              </DetailSection>

            )}


            {/* Footer */}

            <div className="flex justify-end gap-3 mt-7 pt-5 border-t border-slate-100">

              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Close
              </button>

              {request.status ===
                "Open" && (

                <button
                  type="button"
                  disabled={
                    cancellingId ===
                    request._id
                  }
                  onClick={() =>
                    onCancel(
                      request._id
                    )
                  }
                  className="px-5 py-2.5 rounded-xl bg-red-600 text-white text-sm font-bold hover:bg-red-700 disabled:opacity-50"
                >
                  {cancellingId ===
                  request._id
                    ? "Cancelling..."
                    : "Cancel request"}
                </button>

              )}

            </div>

          </div>

        ) : (

          <div className="p-12 text-center">

            <p className="text-sm text-slate-500">
              Request could not be loaded.
            </p>

          </div>

        )}

      </div>

    </div>
  );
};


// =========================================================
// FORM SECTION
// =========================================================

const FormSection = ({
  number,
  title,
  description,
  children,
}) => (

  <section>

    <div className="flex gap-3 mb-5">

      <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center text-[10px] font-black shrink-0">
        {number}
      </div>

      <div>

        <h3 className="text-sm font-bold text-slate-900">
          {title}
        </h3>

        <p className="text-xs text-slate-400 mt-0.5">
          {description}
        </p>

      </div>

    </div>

    {children}

  </section>
);


// =========================================================
// INPUT
// =========================================================

const InputField = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required,
  error,
  min,
  step,
}) => (

  <div>

    <label className="block text-xs font-bold text-slate-600 mb-2">

      {label}

      {required && (
        <span className="text-red-500 ml-1">
          *
        </span>
      )}

    </label>

    <input
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      min={min}
      step={step}
      className={`w-full rounded-xl border ${
        error
          ? "border-red-300 bg-red-50/40 focus:border-red-500 focus:ring-red-500/10"
          : "border-slate-200 bg-slate-50 focus:bg-white focus:border-red-400 focus:ring-red-500/10"
      } px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:ring-4 transition`}
    />

    {error && (
      <p className="text-[11px] text-red-600 mt-1.5">
        {error}
      </p>
    )}

  </div>
);


// =========================================================
// SELECT
// =========================================================

const SelectField = ({
  label,
  name,
  value,
  onChange,
  options,
  placeholder,
  required,
  disabled,
  error,
}) => (

  <div>

    <label className="block text-xs font-bold text-slate-600 mb-2">

      {label}

      {required && (
        <span className="text-red-500 ml-1">
          *
        </span>
      )}

    </label>

    <select
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`w-full rounded-xl border ${
        error
          ? "border-red-300 bg-red-50/40"
          : "border-slate-200 bg-slate-50"
      } px-4 py-3 text-sm text-slate-800 outline-none focus:bg-white focus:border-red-400 focus:ring-4 focus:ring-red-500/10 transition disabled:opacity-50 disabled:cursor-not-allowed`}
    >

      <option value="">
        {placeholder}
      </option>

      {options.map((option) => (

        <option
          key={option.value}
          value={option.value}
        >
          {option.label}
        </option>

      ))}

    </select>

    {error && (
      <p className="text-[11px] text-red-600 mt-1.5">
        {error}
      </p>
    )}

  </div>
);


// =========================================================
// URGENCY OPTION
// =========================================================

const UrgencyOption = ({
  urgency,
  selected,
  onClick,
}) => {

  const styles = {
    Low: {
      selected:
        "border-emerald-400 bg-emerald-50",
      dot: "bg-emerald-500",
      text: "text-emerald-700",
    },

    Medium: {
      selected:
        "border-amber-400 bg-amber-50",
      dot: "bg-amber-500",
      text: "text-amber-700",
    },

    High: {
      selected:
        "border-orange-400 bg-orange-50",
      dot: "bg-orange-500",
      text: "text-orange-700",
    },

    Critical: {
      selected:
        "border-red-400 bg-red-50",
      dot: "bg-red-500",
      text: "text-red-700",
    },
  };

  const style =
    styles[urgency.value];

  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-left p-3.5 rounded-xl border transition ${
        selected
          ? style.selected
          : "border-slate-200 bg-white hover:border-slate-300"
      }`}
    >

      <div className="flex items-center gap-2">

        <span
          className={`w-2.5 h-2.5 rounded-full ${style.dot}`}
        />

        <span
          className={`text-xs font-bold ${
            selected
              ? style.text
              : "text-slate-700"
          }`}
        >
          {urgency.label}
        </span>

      </div>

      <p className="text-[10px] text-slate-400 mt-1 ml-[18px]">
        {urgency.description}
      </p>

    </button>
  );
};


// =========================================================
// STATUS
// =========================================================

const getStatusConfig = (
  status
) => {

  switch (status) {

    case "Completed":
      return {
        label: "Completed",
        badge:
          "bg-emerald-50 text-emerald-700",
      };

    case "Cancelled":
      return {
        label: "Cancelled",
        badge:
          "bg-slate-100 text-slate-500",
      };

    default:
      return {
        label: "Open",
        badge:
          "bg-blue-50 text-blue-700",
      };
  }
};


// =========================================================
// URGENCY
// =========================================================

const getUrgencyConfig = (
  urgency
) => {

  switch (urgency) {

    case "Critical":
      return {
        badge:
          "bg-red-50 text-red-700",
      };

    case "High":
      return {
        badge:
          "bg-orange-50 text-orange-700",
      };

    case "Low":
      return {
        badge:
          "bg-emerald-50 text-emerald-700",
      };

    default:
      return {
        badge:
          "bg-amber-50 text-amber-700",
      };
  }
};


// =========================================================
// STATUS BADGE
// =========================================================

const StatusBadge = ({
  config,
}) => (

  <span
    className={`px-2 py-1 rounded-lg text-[10px] font-bold ${config.badge}`}
  >
    {config.label}
  </span>

);


// =========================================================
// INFO ITEM
// =========================================================

const InfoItem = ({
  icon,
  label,
  value,
}) => (

  <div className="min-w-0">

    <p className="text-[10px] uppercase tracking-wide font-bold text-slate-400">
      {label}
    </p>

    <p className="text-xs font-semibold text-slate-700 truncate mt-1">
      {icon} {value}
    </p>

  </div>
);


// =========================================================
// DETAIL BOX
// =========================================================

const DetailBox = ({
  label,
  value,
}) => (

  <div className="rounded-xl bg-slate-50 border border-slate-100 p-3.5">

    <p className="text-[10px] uppercase tracking-wide font-bold text-slate-400">
      {label}
    </p>

    <p className="text-sm font-semibold text-slate-700 mt-1 break-words">
      {value}
    </p>

  </div>
);


// =========================================================
// DETAIL SECTION
// =========================================================

const DetailSection = ({
  title,
  children,
}) => (

  <section className="mt-6">

    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
      {title}
    </h3>

    {children}

  </section>
);


// =========================================================
// STAT CARD
// =========================================================

const StatCard = ({
  label,
  value,
  color,
  className = "",
}) => {

  const colors = {
    red:
      "bg-red-50 text-red-600",

    emerald:
      "bg-emerald-50 text-emerald-600",

    slate:
      "bg-slate-100 text-slate-600",

    blue:
      "bg-blue-50 text-blue-600",
  };

  return (
    <div
      className={`px-3 py-2 rounded-xl ${colors[color]} ${className}`}
    >

      <p className="text-lg font-black">
        {value}
      </p>

      <p className="text-[9px] font-semibold uppercase tracking-wide opacity-70">
        {label}
      </p>

    </div>
  );
};


// =========================================================
// TAB
// =========================================================

const TabButton = ({
  active,
  onClick,
  children,
}) => (

  <button
    type="button"
    onClick={onClick}
    className={`px-4 py-2.5 rounded-lg text-xs font-bold transition ${
      active
        ? "bg-white text-slate-900 shadow-sm"
        : "text-slate-500 hover:text-slate-700"
    }`}
  >
    {children}
  </button>
);


// =========================================================
// ALERT
// =========================================================

const Alert = ({
  type,
  message,
  onClose,
}) => {

  const success =
    type === "success";

  return (
    <div
      className={`mb-5 rounded-xl border p-4 ${
        success
          ? "bg-emerald-50 border-emerald-100 text-emerald-700"
          : "bg-red-50 border-red-100 text-red-700"
      }`}
    >

      <div className="flex items-start gap-3">

        <span className="font-bold">
          {success ? "✓" : "!"}
        </span>

        <p className="text-sm flex-1">
          {message}
        </p>

        <button
          type="button"
          onClick={onClose}
          className="opacity-60 hover:opacity-100"
        >
          ×
        </button>

      </div>

    </div>
  );
};


// =========================================================
// CHECKLIST
// =========================================================

const ChecklistItem = ({
  text,
}) => (

  <div className="flex gap-2.5 items-start">

    <span className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-[10px] shrink-0">
      ✓
    </span>

    <p className="text-xs text-slate-500 leading-5">
      {text}
    </p>

  </div>
);


// =========================================================
// FORMAT DATE
// =========================================================

const formatDate = (
  date,
  includeTime = false
) => {

  if (!date) {
    return "—";
  }

  const parsed =
    new Date(date);

  if (
    Number.isNaN(
      parsed.getTime()
    )
  ) {
    return "—";
  }

  return new Intl.DateTimeFormat(
    "en-NP",
    {
      dateStyle: "medium",
      ...(includeTime
        ? {
            timeStyle: "short",
          }
        : {}),
    }
  ).format(parsed);
};


// =========================================================
// SPINNER
// =========================================================

const Spinner = ({
  dark = false,
}) => (

  <span
    className={`inline-block w-4 h-4 border-2 rounded-full animate-spin ${
      dark
        ? "border-slate-300 border-t-slate-700"
        : "border-white/40 border-t-white"
    }`}
  />

);


// =========================================================
// ICONS
// =========================================================

const BloodDropIcon = ({
  size = 20,
}) => (

  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M12 3S6 10 6 14a6 6 0 0 0 12 0c0-4-6-11-6-11Z" />
    <path d="M9 15a3 3 0 0 0 3 3" />
  </svg>

);


const HeartPulseIcon = () => (

  <svg
    width="19"
    height="19"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M3 12h4l2-7 4 14 2-7h6" />
    <path d="M20.8 8.8c0 5.2-8.8 10.2-8.8 10.2S3.2 14 3.2 8.8A4.8 4.8 0 0 1 12 6.1a4.8 4.8 0 0 1 8.8 2.7Z" />
  </svg>

);


const AlertIcon = () => (

  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M10.3 3.6 2.2 18a2 2 0 0 0 1.7 3h16.2a2 2 0 0 0 1.7-3L13.7 3.6a2 2 0 0 0-3.4 0Z" />
    <path d="M12 9v4" />
    <path d="M12 17h.01" />
  </svg>

);


export default BloodRequest;
