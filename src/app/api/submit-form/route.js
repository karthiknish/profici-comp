import { NextResponse } from "next/server";

const GRAVITY_FORMS_ENDPOINT =
  "https://profici.co.uk/wp-json/weboforms/v1/proficigro";
const FORM_ID = 13; // As specified in the feedback

export async function POST(request) {
  try {
    const inputData = await request.json();

    // --- Data Transformation ---
    // Map your form field names to Gravity Forms field IDs based on the required format
    const gravityFormData = {
      17.2: {
        field_name: "Name (Prefix)",
        field_value: inputData.namePrefix || "",
        field_type: "name",
      },
      17.3: {
        field_name: "Name (First)",
        field_value: inputData.contactName || "",
        field_type: "name",
      },
      17.4: {
        field_name: "Name (Middle)",
        field_value: inputData.nameMiddle || "",
        field_type: "name",
      },
      17.6: {
        field_name: "Name (Last)",
        field_value: inputData.nameLast || "",
        field_type: "name",
      },
      17.8: {
        field_name: "Name (Suffix)",
        field_value: inputData.nameSuffix || "",
        field_type: "name",
      },
      18: {
        field_name: "Email",
        field_value: inputData.email || "",
        field_type: "email",
      },
      19: {
        field_name: "Phone",
        field_value: inputData.phone || "",
        field_type: "phone",
      },
      26: {
        field_name: "Company",
        field_value: inputData.businessName || "",
        field_type: "text",
      },
      29: {
        field_name: "Website",
        field_value: inputData.website || "",
        field_type: "text",
      },
      28: {
        field_name: "Industry",
        field_value: inputData.industry || "",
        field_type: "text",
      },
      27: {
        field_name: "Competitors",
        field_value: JSON.stringify(inputData.competitors || []),
        field_type: "list",
      },
    };

    const payload = {
      form_id: FORM_ID,
      form_data: gravityFormData,
    };

    // --- Send to Gravity Forms API ---
    const response = await fetch(GRAVITY_FORMS_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Add Authorization header if required by the endpoint
        // "Authorization": "Bearer YOUR_API_TOKEN",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      let errorBody = `Gravity Forms API error: ${response.status}`;
      try {
        const errorData = await response.json();
        // Adjust error parsing based on actual Gravity Forms API error structure
        errorBody = errorData.message || JSON.stringify(errorData) || errorBody;
      } catch (e) {
        /* Ignore if error body isn't JSON */
      }
      throw new Error(errorBody);
    }

    const responseData = await response.json();
    console.log("Gravity Forms API Response:", responseData);

    // Return success response from your API
    return NextResponse.json(
      { success: true, gravityFormsResponse: responseData },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to submit to Gravity Forms:", error);
    return NextResponse.json(
      { error: "Failed to submit form data", details: error.message },
      { status: 500 }
    );
  }
}
