import React, {Component} from 'react';
import './App.css';
import {
  Avatar,
  Button, Checkbox, Container, Dialog, DialogContent, DialogTitle, FormControlLabel,
  Grid,
  IconButton, Link,
  makeStyles,
  MenuItem, Paper,
  Snackbar,
  SnackbarContent,
  TextField, Typography
} from "@material-ui/core";
import CheckCircleIcon from "@material-ui/icons/CheckCircle"
import InfoIcon from "@material-ui/icons/Info";
import WarningIcon from "@material-ui/icons/Warning";
import ErrorIcon from "@material-ui/icons/Error";
import CloseIcon from "@material-ui/icons/Close";

import LogoImage from "../src/assets/logo.png";
import axios from 'axios'
import qs from 'qs';
import ReactMarkdown from "react-markdown";
import {amber, green} from "@material-ui/core/colors";
import {SnackbarOrigin} from "@material-ui/core/Snackbar";


const api = axios.create({
  headers: {
    post: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    get: {
      "Content-Type": "application/x-www-form-urlencoded",
    }
  },
  transformRequest: [(data) => qs.stringify(data, {arrayFormat: "brackets"})],
  baseURL: "http://recruit.xust-kcsoft.club/interfaces/main",
});


const variantIcons = {
  success: CheckCircleIcon,
  info: InfoIcon,
  warning: WarningIcon,
  error: ErrorIcon
};

type PopupSnackBarVariant = keyof typeof variantIcons;

interface PopupSnackBarProps {
  variant: PopupSnackBarVariant;
  open: boolean;
  message: string;
  anchorOrigin: SnackbarOrigin;
  onClosed: () => void;
}


const PopupSnackBar: React.FC<PopupSnackBarProps> = ({variant, open, message, anchorOrigin, onClosed}) => {
  const styles = makeStyles(theme => ({
    success: {
      backgroundColor: green[600],
    },
    error: {
      backgroundColor: theme.palette.error.dark,
    },
    info: {
      backgroundColor: theme.palette.primary.main,
    },
    warning: {
      backgroundColor: amber[700],
    },
    icon: {
      fontSize: 20,
      marginRight: theme.spacing(1),
    },
    message: {
      display: "flex",
      alignItems: "center"
    }
  }))();
  const Icon = variantIcons[variant];
  const Content: React.FC = () => <SnackbarContent
    className={styles[variant]}
    message={
      <span className={styles.message}>
        <Icon className={styles.icon}/>
        {message}
      </span>
    }
    action={[
      <IconButton key={"icon"} onClick={onClosed} color={"inherit"}>
        <CloseIcon className={styles.icon}/>
      </IconButton>
    ]}
  />;
  return <Snackbar
    open={open}
    autoHideDuration={8000}
    onClose={onClosed}
    anchorOrigin={anchorOrigin}
  >

    <Content/>
  </Snackbar>

};


const Logo: React.FC = () => {
  const styles = makeStyles((theme)=>({
    logo: {
      width: 64,
      height: 64,
      [theme.breakpoints.down("sm")]: {
        width: 32,
        height: 32,
      }
    }
  }))();
  const handleClick = () => {
    window.location.href = "https://www.xust-kcsoft.club"
  };
  return (
    <IconButton onClick={handleClick}>
     <Avatar src={LogoImage}  className={styles.logo}/>
    </IconButton>
  );
};

const Title: React.FC = () => {
  const styles = makeStyles((theme) => ({
    text: {
      fill: "#1E1B74",
      fontSize: 28,
      textAlign: "center",
      [theme.breakpoints.down("sm")]: {
        fontSize: 18,
      }
    },
    container: {
      marginTop: 5,
      alignItems: "center",
      justify: "space-between",
    }
  }))();
  return <Grid container={true} className={styles.container}>
    <Grid item={true} xs={3}>
      <Logo/>
    </Grid>
    <Grid item={true} xs={9}>
      <Typography className={styles.text}>2019招新考核报名</Typography>
    </Grid>

  </Grid>
};

interface ValidatableFieldOnChangedProps {
  onChanged: (text: string) => void;
}

interface ValidatableFieldProps extends ValidatableFieldOnChangedProps {
  isValid?: (text: string) => boolean;
  label: String;
}

interface ValidatableFieldStates {
  valid: boolean;
}


class ValidatableField extends Component<ValidatableFieldProps, ValidatableFieldStates> {

  constructor(props: ValidatableFieldProps) {
    super(props);
    this.state = {
      valid: false
    };
  }


  public render() {
    const {isValid, label, onChanged} = this.props;
    const {valid} = this.state;
    if (isValid) {

      const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        const valid = isValid(value);
        this.setState({
          valid
        });
        if (valid) onChanged(value);
      };

      return <TextField fullWidth={true} label={label} required={true} error={!valid} onChange={onChange}/>

    } else
      return <TextField fullWidth={true} label={label} required={true} error={!valid}/>
  }
}


const makeValidatableField = (props: ValidatableFieldProps) => (
  <ValidatableField {...props}/>
);


const NameField: React.FC<ValidatableFieldOnChangedProps> = ({onChanged}) => {
  const props: ValidatableFieldProps = {
    label: "姓名",
    isValid: text => /^[\u4E00-\u9FA5·]+$/.test(text),
    onChanged,
  };
  return makeValidatableField(props);
};

const IDField: React.FC<ValidatableFieldOnChangedProps> = ({onChanged}) => {
  const props: ValidatableFieldProps = {
    label: "学号",
    isValid: text => /1[89]\d{9}/.test(text),
    onChanged,
  };
  return makeValidatableField(props);
};

const PhoneNumberField: React.FC<ValidatableFieldOnChangedProps> = ({onChanged}) => {
  const props: ValidatableFieldProps = {
    label: "电话号码",
    isValid: text => /^1[3456789]\d{9}$/.test(text),
    onChanged,
  };
  return makeValidatableField(props);
};

const EmailField: React.FC<ValidatableFieldOnChangedProps> = ({onChanged}) => {
  const props: ValidatableFieldProps = {
    label: "邮箱",
    isValid: text => /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/.test(text),
    onChanged,
  };
  return makeValidatableField(props);
};


interface SelectableFieldElement<V> {
  value: V;
  label: string;
  disabled?: boolean
}


interface SelectableFieldOnChangedProps<V> {
  onChanged: (label: string, value: V) => void;
}

interface SelectableFieldProps<V> extends SelectableFieldOnChangedProps<V> {
  label: string;
  list: SelectableFieldElement<V>[];
  defaultValue: V;
  defaultLabel: string;
}

interface SelectableFieldState<V> {
  selectedLabel: string;
  isValid: boolean;
}


class SelectableField<V extends number | string> extends React.Component<SelectableFieldProps<V>, SelectableFieldState<V>> {
  constructor(props: SelectableFieldProps<V>) {
    super(props);
    this.state = {
      selectedLabel: this.props.defaultLabel,
      isValid: false,
    }
  }

  render() {
    const {list, label, onChanged} = this.props;
    const {selectedLabel, isValid} = this.state;
    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const selectedLabel = event.target.value;
      const element = list.find(item => item.label === selectedLabel);
      const value = element ? element.value : this.props.defaultValue;
      const isValid = value !== 0;
      this.setState(
        {
          isValid, selectedLabel
        }
      );
      if (isValid) onChanged(selectedLabel, value);
    };
    return (
      <TextField
        label={label}
        select={true}
        fullWidth={true}
        value={selectedLabel}
        onChange={onChange}
        error={!isValid}

      >
        {list.map(item => <MenuItem value={item.label} disabled={item.disabled}
                                    key={item.value}>{item.label}</MenuItem>)}
      </TextField>
    );
  }
}

const CollegeField: React.FC<SelectableFieldOnChangedProps<number>> = ({onChanged}) => {
  const colleges: SelectableFieldElement<number>[] = [
    {
      value: 0,
      label: "请选择",
      disabled: true,
    },
    {
      value: 1,
      label: "理学院",
    },
    {
      value: 2,
      label: "管理学院",
    },
    {
      value: 3,
      label: "能源学院",
    },
    {
      value: 4,
      label: "建工学院",
    },
    {
      value: 5,
      label: "机械学院",
    },
    {
      value: 6,
      label: "电控学院",
    },
    {
      value: 7,
      label: "通信学院"
    },
    {
      value: 8,
      label: "计算机学院",
    },
    {
      value: 9,
      label: "地环学院",
    },
    {
      value: 10,
      label: "测绘学院",
    },
    {
      value: 11,
      label: "材料学院",
    },
    {
      value: 14,
      label: "化工学院",
    },
    {
      value: 15,
      label: "艺术学院",
    },
    {
      value: 17,
      label: "安全学院",
    },
    {
      value: 18,
      label: "人文与外国语学院"
    }
  ];
  const defaultElement = colleges[0];
  return <SelectableField onChanged={onChanged} defaultLabel={defaultElement.label} defaultValue={defaultElement.value}
                          label={"学院"} list={colleges}/>
};


interface Major {
  major_name: string;
  id: number;
}

async function getMajors(collegeID: number): Promise<Major[]> {
  const {data} = await api.post<Array<Major> | string>("/ajaxGetMajor", {
    college_id: collegeID
  });
  if (typeof data == "string") {
    throw data
  }
  return data;

}

class MajorFieldElement implements SelectableFieldElement<string> {
  label: string;

  constructor(public value: string, public disabled: boolean = false) {
    this.label = value;
  }
}

type MajorFieldProps = SelectableFieldOnChangedProps<string> & {
  elements: MajorFieldElement[] | undefined;
}

const MajorField: React.FC<MajorFieldProps> = ({onChanged, elements,}) => {
  const majors: MajorFieldElement[] = [
    new MajorFieldElement("请选择", false),
    ...(elements || [])
  ];
  const {label} = majors[0];
  return <SelectableField label={"专业"} list={majors} defaultValue={label} defaultLabel={label} onChanged={onChanged}/>;
};


const VerificationCodeField: React.FC<ValidatableFieldOnChangedProps> = ({onChanged}) => {
  const props: ValidatableFieldProps = {
    onChanged,
    isValid: text => /[^0]\d{5}/.test(text),
    label: "验证码",
  };
  return makeValidatableField(props);
};

interface SendVerificationCodeButtonState {
  countDown: number;
  disabled: boolean;
}

interface StatusHandlerProps {
  onSuccess: (message: string) => void;
  onInfo: (message: string) => void;
  onError: (message: string) => void;

}


interface SendVerificationCodeButtonProps extends StatusHandlerProps {
  name: string;
  email: string;
  disabled: boolean;
}

class SendVerificationCodeButton extends Component<SendVerificationCodeButtonProps, SendVerificationCodeButtonState> {


  private static MAX_COUNT_DOWN = 60;

  private interval: any;

  public state = {
    countDown: SendVerificationCodeButton.MAX_COUNT_DOWN,
    disabled: false
  };


  private async requestVerificationCode(): Promise<boolean> {
    type Result = {
      message: string,
      status: number,
    }
    const {onSuccess, onInfo, onError} = this.props;
    try {
      const {data} = await api.post<Result>("/sendMail", this.props);
      const {status, message} = data;
      const handlers = [onSuccess, onInfo, onError];
      handlers[status](message);
      return true;
    } catch (e) {
      console.log(e);
      onError("网络错误");
      return false;
    }

  }

  private handleClicked = async () => {
    console.assert(!this.interval);

    if (!(await this.requestVerificationCode())) return;
    this.setState({
      disabled: true
    });
    this.interval = setInterval(() => {
      const {countDown} = this.state;
      if (countDown === 0) {
        clearInterval(this.interval);
        this.interval = null;
        this.setState({
          countDown: SendVerificationCodeButton.MAX_COUNT_DOWN,
          disabled: false,
        });
        return
      }
      this.setState({
        countDown: countDown - 1
      })
    }, 1000)
  };

  render() {
    const {disabled, countDown} = this.state;
    return <Button color={"primary"} fullWidth={true} variant={"outlined"} disabled={disabled || this.props.disabled}
                   onClick={this.handleClicked}>
      {
        this.props.disabled ? "发送验证码" : disabled ? countDown.toString() : "发送验证码"
      }
    </Button>
  }
}

interface Student {
  name: string | undefined;
  email: string | undefined;
  code: string | undefined;
  student_id: string | undefined;
  telephone: string | undefined;
  major: string | undefined;
}

interface SubmitButtonProps {
  param: Student;
  handlerProps: StatusHandlerProps;
  privacyPolicyConfirmed: boolean;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({param, handlerProps, privacyPolicyConfirmed}) => {
  const styles = makeStyles({
    root: {
      fill: "white"
    }
  })();

  const disabled = !privacyPolicyConfirmed || Object.keys(param).filter(key => param.hasOwnProperty(key)).some(key => param[key as keyof typeof param] === undefined);
  const {onSuccess, onInfo, onError} = handlerProps;
  const handlers = [onSuccess, onInfo, onError];
  const handleClick = async () => {
    type Result = {
      message: string;
      status: number;
    }
    try {
      const {data} = await api.post<Result>("/submit", param);
      const {message, status} = data;
      handlers[status](message);
    } catch (e) {
      onError("网络错误");
    }

  };
  return <Button className={styles.root} fullWidth={true} color={"primary"} variant={"contained"} disabled={disabled} onClick={handleClick}>提交申请</Button>
};

interface PrivacyPolicyFieldProps {
  checked?: boolean;
  onChange: (value: boolean) => void;
  onLinkClicked: () => void
}

const PrivacyPolicyField: React.FC<PrivacyPolicyFieldProps> = ({checked, onChange, onLinkClicked}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => onChange(event.target.checked);
  const link = <Link onClick={onLinkClicked}>《隐私条例》</Link>;
  const props = {
    label: <Typography onClick={event => event.preventDefault()}>已阅读并同意{link}</Typography>,
    control: <Checkbox checked={checked || false} onChange={handleChange} color={"primary"}/>
  };
  return <FormControlLabel {...props}/>
};

interface PrivacyPolicyDialogProps {
  open: boolean;
  onClose: () => void;
}

const PrivacyPolicyDialog: React.FC<PrivacyPolicyDialogProps> = ({open, onClose}) => {
  const policy = "# 《隐私条例》\n\n1. 安全可靠：我们竭尽全力通过合理有效的信息安全技术及管理流程，防止您的信息泄露、损毁、丢失。\n2. 保护通信秘密：我们严格遵照法律法规，保护您的通信秘密，为您提供安全的通信服务。\n3. 合理必要：为了向您和其他用户提供更好的服务，我们仅收集必要的信息。\n4. 我们努力使用简明易懂的表述，向您介绍隐私政策，以便您清晰地了解我们的信息处理方式。\n5. 将隐私保护融入产品设计：我们在产品或服务开发的各个环节，综合法律、产品、设计等多方因素，融入隐私保护的理念。\n\n本《隐私政策》主要向您说明：\n\n- 我们收集哪些信息；\n- 我们收集信息的用途；\n- 您所享有的权利。\n\n希望您仔细阅读《隐私政策》（以下简称“本政策”），详细了解我们对信息的收集、使用方式，以便您更好地了解我们的服务并作出适当的选择。\n\n## 我们收集的信息 我们根据合法、正当、必要的原则，仅收集实现产品功能所必要的信息。\n\n### 您在使用我们服务时主动提供的信息\n\n您在注册帐户时填写的信息。 例如，您在注册帐户时所填写的姓名、手机号码。\n\n### 我们在您使用服务时获取的信息\n\n#### 日志信息\n\n当您使用我们的服务时，我们可能会自动收集相关信息并存储为服务日志信息。\n\n(1)软件信息。例如，软件的版本号、浏览器类型。为确保操作环境的安全或提供服务所需，我们会收集有关您使用的移动应用和其他软件的信息。\n\n(2) IP地址。\n\n(3)服务日志信息。例如，您在使用我们服务时搜索、查看的信息、服务故障信息、引荐网址等信息。\n\n## 我们可能基于以下目的披露您的个人信息：\n\n1. 遵守适用的法律法规等有关规定；\n2. 遵守法院判决、裁定或其他法律程序的规定；\n3. 遵守相关政府机关或其他法定授权组织的要求；\n4. 我们有理由确信需要遵守法律法规等有关规定；\n5. 为执行相关服务协议或本政策、维护社会公共利益，为保护我们的成员、我们或我们的关联实验室、其他成员或老师的人身财产安全或其他合法权益合理且必要的用途。\n\n## 存储信息的地点和期限\n\n1. 存储信息的地点： 我们遵守法律法规的规定，将境内收集的用户个人信息存储于境内。\n2. 存储信息的期限： 一般而言，我们仅为实现目的所必需的最短时间保留您的个人信息。但在下列情况下，我们有可能因需符合法律要求，更改个人信息的存储时间： \n\n> 1. 为遵守适用的法律法规等有关规定；\n> 2. 为遵守法院判决、裁定或其他法律程序的规定；\n> 3. 为遵守相关政府机关或法定授权组织的要求；\n> 4. 我们有理由确信需要遵守法律法规等有关规定；\n> 5. 为执行相关服务协议或本政策、维护社会公共利益，为保护我们的成员、我们或我们的关联实验室、其他成员或老师的人身财产安全或其他合法权益合理且必要的用途。\n\n当我们的产品或服务发生停止运营的情形时，我们将采取例如，推送通知、公告等形式通知您，并在合理的期限内删除或匿名化处理您的个人信息。\n\n## 信息安全\n\n我们为您的信息提供相应的安全保障，以防止信息的丢失、不当使用、未经授权访问或披露。\n\n1. 我们严格遵守法律法规保护用户的通信秘密。\n2. 我们将在合理的安全水平内使用各种安全保护措施以保障信息的安全。例如，我们使用加密技术（例如，TLS、SSL）、匿名化处理等手段来保护您的个人信息。\n3. 我们建立专门的管理制度、流程和组织确保信息安全。例如，我们严格限制访问信息的人员范围，要求他们遵守保密义务，并进行审查。\n4. 若发生个人信息泄露等安全事件，我们会启动应急预案，阻止安全事件扩大，并以推送通知、公告等形式告知您。\n\n## 适用范围 \n\n我们的所有服务均适用本政策。但某些服务有其特定的隐私指引/声明，该特定隐私指引/声明更具体地说明我们在该服务中如何处理您的信息。如本政策与特定服务的隐私指引/声明有不一致之处，请以该特定隐私指引/声明为准。 请您注意，本政策不适用由其他组织或个人提供的服务。例如，其他实验室或个人提供的服务。 您使用该等第三方服务须受其隐私政策（而非本政策）约束，您需要仔细阅读其政策内容。\n\n## 联系我们\n\n如您对本政策或其他相关事宜有疑问，请通过官网底部注明的联系方式与我们联系。我们将尽快审核所涉问题，并在验证您的用户身份后的三十天内予以回复。\n\n## 变更\n\n我们可能适时修订本政策内容。如该等变更会导致您在本政策项下权利的实质减损，我们将在变更生效前，通过在页面显著位置提示、向您发送电子邮件等方式通知您。在该种情况下，若您继续使用我们的服务，即表示同意受经修订的政策约束"
  return <Dialog open={open} onClose={onClose}>
    <DialogTitle disableTypography={true} style={{alignSelf: "flex-end"}}>
      <IconButton onClick={onClose}>
        <CloseIcon/>
      </IconButton>
    </DialogTitle>
    <DialogContent dividers>
      <ReactMarkdown source={policy}/>
    </DialogContent>
  </Dialog>
};


interface AppState {
  name: string | undefined;
  id: string | undefined;
  phoneNumber: string | undefined;
  email: string | undefined;
  collegeLabel: string | undefined;
  collegeValue: number | undefined;
  majors: MajorFieldElement[] | undefined;
  major: string | undefined;
  verificationCode: string | undefined;
  snackBarOpen: boolean;
  snackBarVariant: PopupSnackBarVariant;
  snackBarMessage: string;
  snackBarOriginAnchor: SnackbarOrigin;
  privacyPolicyConfirmed: boolean;
  privacyPolicyDialogOpen: boolean;
}


class App extends Component<object, AppState> {

  public state = {
    name: undefined,
    id: undefined,
    phoneNumber: undefined,
    email: undefined,
    collegeLabel: undefined,
    collegeValue: undefined,
    majors: undefined,
    major: undefined,
    verificationCode: undefined,
    privacyPolicyConfirmed: false,
    privacyPolicyDialogOpen: false,
    snackBarVariant: "info" as PopupSnackBarVariant,
    snackBarMessage: "",
    snackBarOpen: false,
    snackBarOriginAnchor: {
      horizontal: "center",
      vertical: "bottom",
    } as SnackbarOrigin,
  };

  private showSnackBar = (variant: PopupSnackBarVariant, message: string, anchor: SnackbarOrigin = {
    horizontal: "center",
    vertical: "bottom"
  }) =>
    this.setState({
      snackBarOpen: true,
      snackBarOriginAnchor: anchor,
      snackBarMessage: message,
      snackBarVariant: variant,
    });


  render() {
    const {snackBarVariant, snackBarOpen, snackBarMessage, snackBarOriginAnchor, name, email, id, verificationCode, major, phoneNumber, privacyPolicyConfirmed, privacyPolicyDialogOpen} = this.state;
    const student: Student = {
      name,
      major,
      email,
      student_id: id,
      code: verificationCode,
      telephone: phoneNumber,
    };

    const handleNameChanged = (name: string) => this.setState({name});
    const handleIDChanged = (id: string) => this.setState({id});
    const handlePhoneNumberChanged = (phoneNumber: string) => this.setState({phoneNumber});
    const handleEmailChanged = (email: string) => this.setState({email});
    const handleCollegeChanged = async (collegeLabel: string, collegeValue: number) => {
      this.setState({collegeLabel, collegeValue, major: undefined}, async () => {
          try {
            const rawData = await getMajors(collegeValue);
            this.setState({majors: rawData.map(it => new MajorFieldElement(it.major_name))});
          } catch (e) {
            this.showSnackBar("error", "网络错误")
          }
        }
      );
    };
    const handleMajorChanged = (major: string) => this.setState({major});
    const handleVerificationCodeChanged = (verificationCode: string) => this.setState({verificationCode});
    const handlePrivacyPolicyConfirmedChanged = (value: boolean) => this.setState({privacyPolicyConfirmed: value});
    const handleSnackClosed = () => this.setState({snackBarOpen: false});
    const handlePrivacyPolicyClosed = () => this.setState({privacyPolicyDialogOpen: false});
    const handlePrivacyPolicyLinkClicked = () => this.setState({privacyPolicyDialogOpen: true});
    const handlerProps: StatusHandlerProps = {
      onSuccess: (message: string) => this.showSnackBar("success", message),
      onError: (message: string) => this.showSnackBar("error", message),
      onInfo: (message: string) => this.showSnackBar("info", message),
    };

    const sendVerificationButtonDisabled = name === undefined || email === undefined;


    return (


      <Container maxWidth={'sm'}>
        <Grid direction={"row"} container={true} style={{height: "100vh"}} alignItems={"center"} justify={"center"}>
          <Grid item={true} xs={9}>
            <Paper elevation={8}>
              <Grid container={true} direction={"row"} justify={"center"} spacing={2}>

                <Grid item={true} xs={10}>
                  <Title/>
                </Grid>

                <Grid item={true} xs={10}>
                  <NameField onChanged={handleNameChanged}/>
                </Grid>
                <Grid item={true} xs={10}>
                  <IDField onChanged={handleIDChanged}/>
                </Grid>
                <Grid item={true} xs={10}>
                  <Grid container={true} justify={"center"}>
                    <Grid item={true} xs={6}>
                      <CollegeField onChanged={handleCollegeChanged}/>
                    </Grid>
                    <Grid item={true} xs={6}>
                      <MajorField onChanged={handleMajorChanged} elements={this.state.majors}/>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item={true} xs={10}>
                  <PhoneNumberField onChanged={handlePhoneNumberChanged}/>
                </Grid>
                <Grid item={true} xs={10}>
                  <EmailField onChanged={handleEmailChanged}/>
                </Grid>
                <Grid item={true} xs={10}>
                  <Grid container={true} alignItems={"flex-end"} justify={"center"}>
                    <Grid item={true} xs={6}>
                      <VerificationCodeField onChanged={handleVerificationCodeChanged}/>
                    </Grid>
                    <Grid item={true} xs={6}>
                      <SendVerificationCodeButton disabled={sendVerificationButtonDisabled} name={name!}
                                                  email={email!} {...handlerProps} />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item={true} xs={10}>
                  <SubmitButton param={student} handlerProps={handlerProps} privacyPolicyConfirmed={privacyPolicyConfirmed || false}/>
                </Grid>
                <Grid item={true} xs={10}>
                  <PrivacyPolicyField onChange={handlePrivacyPolicyConfirmedChanged}
                                onLinkClicked={handlePrivacyPolicyLinkClicked}
                                checked={privacyPolicyConfirmed}/>
                </Grid>
              </Grid>
            </Paper>

          </Grid>
        </Grid>
        <PrivacyPolicyDialog open={privacyPolicyDialogOpen} onClose={handlePrivacyPolicyClosed}/>

        <PopupSnackBar
          variant={snackBarVariant}
          open={snackBarOpen}
          message={snackBarMessage}
          anchorOrigin={snackBarOriginAnchor}
          onClosed={handleSnackClosed}
        />

      </Container>


    )
      ;
  }
}


export default App;
