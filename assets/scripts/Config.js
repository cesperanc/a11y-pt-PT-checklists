export const sanitize = (str)=>`${str}`.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^\w\-]+/g, '-');

// Normalize the configuration structure by adding the missing fields and sanitizing IDs
const normalize = (config)=>{
    Object.keys(config).forEach(version=>{
        config[version] = config[version].map((group,index)=>{
            if(!group.groupID){
                group.groupID = index+1;
            }
            if(!group.ID){
                group.ID = sanitize(group.groupID??'');
            }
            
            if(!group.fullName){
                group.fullName = `${group.groupID} - ${group.groupName}`;
            }
        
            group.tests = group.tests.map((test, index)=>{
                if(!test.testID){
                    test.testID = `${group.groupID}.${(index+1)}`;
                }
                if(!test.ID){
                    test.ID = sanitize(test.testID??'');
                }
                if(!test.fullName){
                    test.fullName = `${test.testID} - ${test.name}`;
                }
                return test;
            });
        
            return group;
        });
    });
    return config;
};
export default normalize;