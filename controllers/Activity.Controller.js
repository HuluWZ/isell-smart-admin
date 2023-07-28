const { Activity } = require("../models/Activity");
const uploadToCloud = require("../config/cloudnary");
const { json } = require("body-parser");

require("dotenv").config();

const uploadImages = async (files) => {
  var imageUrlList = []
  for (let i = 0; i < files.length; i++){
       const {url}= await uploadToCloud(files[i].filename);
       imageUrlList.push(url);
  }
  return imageUrlList;
}

exports.createActivity = async (req, res, next) => {
  try {    
    const activityData = JSON.parse(JSON.stringify(req.body))
    console.log(" Data : ", activityData, req.files);
    const nm = activityData.hasOwnProperty("powerOn")
    console.log(" Power On : ", nm);
    activityData.hasOwnProperty("powerOn")?activityData.powerOn = "Yes":activityData.powerOn = "No"
    activityData.hasOwnProperty("functional") ? activityData.functional = "Yes" : activityData.functional = "No"
    activityData.hasOwnProperty("crackFree") ? activityData.crackFree = "Yes" : activityData.crackFree = "No"
    const condition = { powerOn: activityData.powerOn, functional: activityData.functional, crackFree: activityData.crackFree }
    activityData.condition = condition
    console.log(" Data 1 : ", activityData, activityData.condition)
    // remove activityData powerOn, functional, crackFree property
    delete activityData.powerOn
    delete activityData.functional
    delete activityData.crackFree
    console.log(" Data 2 : ", activityData, activityData.condition)
    let newActivity = await Activity.create(activityData);
    var imageURLList = await uploadImages(req.files)
    // save user token
    console.log(" URL -",imageURLList)
    newActivity.images = imageURLList
    res
      .status(201)
      .send({
        item: newActivity,
        message: "Items Created Saved Succesfully !",
        success: true
      });

    await newActivity.save();
  } catch (error) {
    return res.status(400).json({ message: error.message,success: false });
  }
};


exports.updateActivity = async (req, res, next) => {
  try {
    let activityInfo = req.body;
    const { id } = req.params;
    const { files } = req

    if (files) {
      var imageURLList = await uploadImages(files);
      activityInfo.images = imageURLList
    }
    const updatedActivity = await Activity.findOneAndUpdate(
      { _id: id },
      activityInfo,
      { new: true }
    );
    return res
      .status(202)
      .send({
        activity: updatedActivity,
        message: "Activity Updated Succesfully !",
        success: true
      });
  } catch (error) {
    if (error.message) return res.status(404).send({ message: error.message,success: false });
    return res.status(404).send({ message: error, success: false });
  }
};

exports.deleteActivity = async (req, res) => {
  try {
    const {id} = req.params;
    await Activity.deleteById(id);
    return res
      .status(200)
      .send({ message: "Activity has been Deleted Succesfully !",success: true });
  } catch (error) {
    if (error.message) return res.status(404).send({ message: error.message,success: false });
    return res.status(404).send({ message: error ,success: false});
  }
};

exports.getActivity = async (req, res) => {
  try {
    const getActivity = await Activity.findById(req.params.id);
    return res.status(202).send({
      item:getActivity? getActivity: "Activity Not Found",
      message: "Success !",
      success: getActivity?true:false
    });
  } catch (error) {
    if (error.message) return res.status(404).send({ message: error.message,success: false });
    return res.status(404).send({ message: error });
  }
};
exports.getAllActivity = async (req, res) => {
  try {
    const getAll = await Activity.find({}).sort("-updatedAt");
    return res
      .status(202)
      .send({
        totalItem: getAll.length,
        item: getAll,
        success: getAll ? true:false,
      });
  } catch (error) {
    if (error.message) return res.status(404).send({ message: error.message ,success: false });
    return res.status(404).send({ message: error,success: false });
  }
};

exports.searchActivity = async (req, res) => {
  try {
    const { location, name } = req.query;
    // await Activity.deleteById(id);
    const searchActivity = await Activity.find({
          "name": name ? new RegExp(name,'i'): { $exists: true },
          "area": location ? new RegExp(location, 'i') : { $exists: true },
        });
      
    console.log(searchActivity,name,location)
    return res
      .status(200)
      .send({
        searchResult: searchActivity,
        message: searchActivity.length>0? ` ${searchActivity.length} Result  found`: "No Result Not Found",
        success: true
      });
  } catch (error) {
    if (error.message) return res.status(404).send({ message: error.message,success: false });
    return res.status(404).send({ message: error,success: false });
  }
};

exports.filterActivity = async (req, res) => {
  try {
    const { type, location, minDuration, maxDuration, minPrice, maxPrice } = req.query;
    // console.log(type, location, minDuration, maxDuration,minPrice,maxPrice);
    const filterActivity = await Activity.find({
          name: type ? new RegExp(type,'i'): { $exists: true },
          area: location ? new RegExp(location, 'i') : { $exists: true },
          price: minPrice && maxPrice ? { $gte: minPrice,$lte:maxPrice }:{$exists:true},
          duration: minDuration && maxDuration ? {$gte:minDuration,$lte:maxDuration}:{$exists:true}
        });
      
    const query = {
      minPrice,
      maxPrice,
      minDuration,
      maxDuration,
      location,
      type
    }
    console.log(filterActivity,query);
    return res
      .status(200)
      .send({
        filterResult: filterActivity.length>0? filterActivity: "Activity Not Found",
        message: filterActivity.length>0? `${filterActivity.length} Result Found`: "No Activity  Found",
        success:true
      });
  } catch (error) {
    if (error.message) return res.status(404).send({ message: error.message,success: false });
    return res.status(404).send({ message: error,success: false });
  }
};

