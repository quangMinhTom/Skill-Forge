import * as respond from '../../middlewares/RespondMiddleWare.js';
import * as service from '../services/SubSkillService.js';

export const getAllSubs = async function (req, res) {
    try{
        const data = await service.getAllSubs();
        respond.SuceessRespond(res,"success","get all skills",data);
    } catch (e) {
        respond.FailedRespond(res,"failed",e);
    }
}

export const getSubById = async function(req,res){
 try{
     const data = await service.getSubById(req.params.id);
     respond.SuceessRespond(res,"success","get skill by id",data);
 } catch (e) {
     respond.FailedRespond(res,"failed",e);
 }
}

export const createSub = async function(req,res){
    try{
        const data = await service.createSub(req.body);

        if(data !== undefined)
            respond.SuceessRespond(res,"success","create sub skill",data);
        else
            respond.FailedRespond(res,"failed","create sub skill failed");
    }catch (e) {
        respond.FailedRespond(res,"failed",e);
    }
}

export const updateSub = async function(req,res){
    try{
        const data = await service.updateSub(req.params.id,req.body);
        respond.SuceessRespond(res,"success","update skill",data);
    } catch (e) {
        respond.FailedRespond(res,"failed",e);
    }
}

export const deleteSub = async function(req,res){
    try{
       const data = await service.deleteSub(req.params.id);
        respond.SuceessRespond(res,"success","delete skill",data);
    }catch (e) {
        respond.FailedRespond(res,"failed",e);
    }
}