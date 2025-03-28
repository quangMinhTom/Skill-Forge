import * as skillService from '../services/SkillService.js';
import * as respond from '../../middlewares/RespondMiddleWare.js';

export const getAllSkills = async function (req, res) {
    try{
        const data = await skillService.fetchSkills();
        respond.SuceessRespond(res,"success","get all skills",data);
    } catch (e) {
        respond.FailedRespond(res,"failed",e);
    }
}

export const getSkillById = async function(req,res){
 try{
     const data = await skillService.fetchSkillsById(req.params.id);
     respond.SuceessRespond(res,"success","get skill by id",data);
 } catch (e) {
     respond.FailedRespond(res,"failed",e);
 }
}

export const createSkill = async function(req,res){
    try{
        const data = await skillService.createSkill(req.body);
        console.log("adssadadsadadasdssadasdads");
        respond.SuceessRespond(res,"success","create skill",data);
    }catch (e) {
        respond.FailedRespond(res,"failed",e);
    }
}

export const updateSkill = async function(req,res){
    try{
        const data = await skillService.updateSkill(req.params.id,req.body);
        respond.SuceessRespond(res,"success","update skill",data);
    } catch (e) {
        respond.FailedRespond(res,"failed",e);
    }
}

export const deleteSkill = async function(req,res){
    try{
        const data = await skillService.deleteSkill(req.params.id);
        respond.SuceessRespond(res,"success","delete skill",data);
    }catch (e) {
        respond.FailedRespond(res,"failed",e);
    }
}

export const isSkillExist = async function(req,res){
    let data = await skillService.fetchSkillsById(req.params.id);

    if(data != null){
        respond.BooleanRespond(res,"success",Boolean(true));
    }else{
        respond.BooleanRespond(res,"failed",Boolean(false));
    }
}