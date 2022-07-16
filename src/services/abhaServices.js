import 'dotenv/config';
const abhaUtils = require('../utils/abhautils')
const axios = require('axios');
const _ = require('lodash');
const mapping = require('../utils/mapping')

const generateAddressOtp = async (mobile) => {
    let value = await abhaUtils.encryptRSA(mobile);
    let reqBody = {
        value: value,
        authMode: 'MOBILE_OTP',
    };
    const params = {
        method: 'post',
        url: `${process.env.NDHM_PHR_URL}/v1/apps/generate/otp`,
        data: reqBody,
    };
    let result = await abhaUtils.axiosRequest(params);
    return result;
};

const validateAddressOtp = async ({ otp, sessionId }) => {
    let value = await abhaUtils.encryptRSA(otp);
    const params = {
        method: 'post',
        url: `${process.env.NDHM_PHR_URL}/v1/apps/validate/otp`,
        data: {
            value: value,
            sessionId: sessionId,
        },
    };
    const result = await abhaUtils.axiosRequest(params);
    return result;
};

const addressRegistrationDetails = async (obj) => {
    let data = {}
    obj.mobile = await abhaUtils.encryptRSA(obj.mobile);
    if (!obj.alreadyExistedPHR) {
        if (obj.email) obj.email = await abhaUtils.encryptRSA(obj.email);
        let stateName = obj.stateName.toUpperCase();
        let cityName = obj.cityName.toUpperCase();
        let stateCode, districtCode;
        mapping.map((state) => {
            if (state.name === stateName) {
                stateCode = state.code;
                state.districts.map((city) => {
                    if (cityName === city.name) districtCode = city.code;
                });
            }
        });

        obj.stateCode = Number(stateCode);
        obj.districtCode = districtCode;
        let addressRegistrationConfig = {
            method: 'post',
            url: `${process.env.NDHM_PHR_URL}/v1/apps/registration/details`,
            data: _.omit(obj, [
                'alreadyExistedPHR',
                'phrAddress',
                'stateName',
                'cityName',
            ]),
        };
        let result = await abhaUtils.axiosRequest(addressRegistrationConfig);
        return result;
    }
    return [];
};

const addressCreatePhr = async (
    phrAddress,
    sessionId,
    alreadyExistedPHR,
) => {
    const reqBody = {
        alreadyExistedPHR: alreadyExistedPHR,
        sessionId: sessionId,
        phrAddress: phrAddress,
    };

    const params = {
        method: 'post',
        url: `${process.env.NDHM_PHR_URL}/v1/apps/create/phrAddress`,
        data: reqBody,
    };

    const response = await abhaUtils.axiosRequest(params)
    return response;
};

module.exports = {
    generateAddressOtp,
    validateAddressOtp,
    addressRegistrationDetails,
    addressCreatePhr

}