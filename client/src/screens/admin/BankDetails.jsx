// import React from "react";
import { TextField, FormControl, Box, Typography, Button } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { API_ENDPOINTS } from "../../config/url.config";
import { styled } from "@mui/system";

// Styled components
const BankDetailBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
}));

const StyledTypography = styled(Typography)(({ theme }) => ({
  fontWeight: "bold",
  marginBottom: theme.spacing(2),
}));

const StyledBankDetailFormControl = styled(FormControl)(({ theme }) => ({
  margin: theme.spacing(1, 0),
}));

const SubmitBankDetailButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(3),
  marginLeft: theme.spacing(2),
}));

const BankDetails = ({
  formik,
  countryId,
  setBankDetailsShow,
  supplierValues,
}) => {
  const [cookiesData, setCookiesData] = useState();
  const { t } = useTranslation();

  useEffect(() => {
    const storedData = Cookies.get();
    setCookiesData(storedData);
    const organisationId = storedData.organisationId;
  }, []);

  const validationSchema =
    countryId === 1
      ? Yup.object().shape({
          taxId: Yup.string().required(
            `${t("bankDetails.error.taxNumberIsRequired")}`
          ),
          bankName: Yup.string().required(
            `${t("bankDetails.error.bankNameIsRequired")}`
          ),
          accountNumber: Yup.string().required(
            `${t("bankDetails.error.accountNumberIsRequired")}`
          ),
          ifscCode: Yup.string().required(
            `${t("bankDetails.error.ifscCodeIsRequired")}`
          ),
        })
      : Yup.object().shape({
          iban: Yup.string()
            .required(`${t("bankDetails.error.ibanIsRequired")}`)
            .matches(
              /^([A-Z]{2}[0-9]{2}[A-Z0-9]{1,30})$/,
              `${t("bankDetails.error.enterAValidIban")}`
            ),
          bic: Yup.string()
            .required(`${t("bankDetails.error.bicIsRequired")}`)
            .matches(
              /^[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/,
              `${t("bankDetails.error.enterAValidBic")}`
            ),
        });

  // Initialize Formik with validation schema
  const bankformik = useFormik({
    initialValues: {
      taxId: "",
      bankName: "",
      accountNumber: "",
      ifscCode: "",
      iban: "",
      bic: "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const productIdString = JSON.stringify(
          formik.values.productId.map((product) => ({
            productId: product.productId,
            name: product.name,
          }))
        );
        const supplierValues = {
          supplierName: formik.values.supplierName,
          type: parseInt(formik.values.type),
          productId: productIdString,
          email: formik.values.email,
          contactNumber: parseInt(formik.values.contactNumber),
          address: formik.values.address,
          countryId: parseInt(formik.values.countryId),
          organisationId: parseInt(cookiesData.organisationId),
        };

        try {
          const supplierResponse = await axios.post(
            `${API_ENDPOINTS.supplierManagement.supplier}`,
            supplierValues,
            {
              headers: {
                Authorization: `Bearer ${cookiesData.token}`,
              },
            }
          );

          const bankDetailsJson = JSON.stringify({
            taxId: values.taxId,
            bankName: values.bankName,
            accountNumber: values.accountNumber,
            ifscCode: values.ifscCode,
            iban: values.iban,
            bic: values.bic,
          });
          const requestBody = {
            supplierId: supplierResponse.data.supplierId,
            bankDetail: bankDetailsJson,
          };

          const bankResponse = await axios.post(
            `${API_ENDPOINTS.bankDetails.bankDetail}`,
            requestBody,
            {
              headers: {
                Authorization: `Bearer ${cookiesData.token}`,
              },
            }
          );
          toast.success(t("success.supplierDetailsAddedSuccessfully"));

          formik.resetForm();
          bankformik.resetForm();
          setBankDetailsShow(false);
        } catch (error) {
          console.error("There was an error adding bank details!", error.data);
          toast.error(t("error.addingDetails"));
        }
      } catch (error) {
        console.error("Error submitting details:", error);
      }
    },
  });

  return (
    <BankDetailBox
      className="payment"
      component="form"
      onSubmit={bankformik.handleSubmit}
    >
      <StyledTypography variant="h5" component="div">
        {t("bankDetails.text.bankDetails")}
      </StyledTypography>

      {countryId === 1 ? (
        <>
          <StyledBankDetailFormControl fullWidth>
            <TextField
              id="taxId"
              name="taxId"
              label={t("bankDetails.label.taxNumber")}
              variant="outlined"
              size="small"
              value={bankformik.values.taxId}
              onChange={bankformik.handleChange}
              onBlur={bankformik.handleBlur}
              error={
                bankformik.touched.taxId && Boolean(bankformik.errors.taxId)
              }
              helperText={bankformik.touched.taxId && bankformik.errors.taxId}
            />
          </StyledBankDetailFormControl>

          <StyledBankDetailFormControl fullWidth>
            <TextField
              id="bankName"
              name="bankName"
              label={t("bankDetails.label.bankName")}
              variant="outlined"
              size="small"
              value={bankformik.values.bankName}
              onChange={bankformik.handleChange}
              onBlur={bankformik.handleBlur}
              error={
                bankformik.touched.bankName &&
                Boolean(bankformik.errors.bankName)
              }
              helperText={
                bankformik.touched.bankName && bankformik.errors.bankName
              }
            />
          </StyledBankDetailFormControl>

          <StyledBankDetailFormControl fullWidth>
            <TextField
              id="accountNumber"
              name="accountNumber"
              label={t("bankDetails.label.accountNumber")}
              variant="outlined"
              size="small"
              value={bankformik.values.accountNumber}
              onChange={bankformik.handleChange}
              onBlur={bankformik.handleBlur}
              error={
                bankformik.touched.accountNumber &&
                Boolean(bankformik.errors.accountNumber)
              }
              helperText={
                bankformik.touched.accountNumber &&
                bankformik.errors.accountNumber
              }
            />
          </StyledBankDetailFormControl>

          <StyledBankDetailFormControl fullWidth>
            <TextField
              id="ifscCode"
              name="ifscCode"
              label={t("bankDetails.label.ifscCode")}
              variant="outlined"
              size="small"
              value={bankformik.values.ifscCode}
              onChange={bankformik.handleChange}
              onBlur={bankformik.handleBlur}
              error={
                bankformik.touched.ifscCode &&
                Boolean(bankformik.errors.ifscCode)
              }
              helperText={
                bankformik.touched.ifscCode && bankformik.errors.ifscCode
              }
            />
          </StyledBankDetailFormControl>
        </>
      ) : (
        <>
          <StyledBankDetailFormControl fullWidth>
            <TextField
              id="iban"
              name="iban"
              label={t("bankDetails.label.iban")}
              variant="outlined"
              size="small"
              value={bankformik.values.iban}
              onChange={bankformik.handleChange}
              onBlur={bankformik.handleBlur}
              error={bankformik.touched.iban && Boolean(bankformik.errors.iban)}
              helperText={bankformik.touched.iban && bankformik.errors.iban}
            />
          </StyledBankDetailFormControl>

          <StyledBankDetailFormControl fullWidth>
            <TextField
              id="bic"
              name="bic"
              label={t("bankDetails.label.bic")}
              variant="outlined"
              size="small"
              value={bankformik.values.bic}
              onChange={bankformik.handleChange}
              onBlur={bankformik.handleBlur}
              error={bankformik.touched.bic && Boolean(bankformik.errors.bic)}
              helperText={bankformik.touched.bic && bankformik.errors.bic}
            />
          </StyledBankDetailFormControl>
        </>
      )}

      <SubmitBankDetailButton
        variant="contained"
        color="secondary"
        size="large"
        onClick={() => setBankDetailsShow(false)}
      >
        {t("bankDetails.button.back")}
      </SubmitBankDetailButton>
      <StyledButton variant="contained" color="primary" type="submit">
        {t("bankDetails.button.submitDetails")}
      </StyledButton>
    </BankDetailBox>
  );
};

export default BankDetails;
